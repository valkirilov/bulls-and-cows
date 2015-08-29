'use strict';

angular.module('myApp.services.auth', [])
.factory('AuthService', function ($http, ipCookie, $firebaseAuth, $firebaseArray, $firebaseObject, $location, $rootScope) {

  var firebaseRef,
      usersRef,
      authObj,
      usersList,
      friendsList;

  var isNewUser = false;

  var init = function(ref, rootScope) {
    firebaseRef = ref;
    authObj = $firebaseAuth(firebaseRef);

    firebaseRef.onAuth(function(authData) {
      if (authData && isNewUser) {
        // Create the profile of the new user
        var currentDate = new Date();

        ref.child("users").child(authData.uid).set({
          uid: authData.uid,
          provider: authData.provider,
          name: getName(authData),
          registered: currentDate,
          xp: 100,
          level: 1,
          nextLevel: getNextLevelXp(1),
          avatar: authData.password.profileImageURL,
          email: authData.password.email,
          gamesWon: 0,
          gamesLost: 0,
          badge: 'Beginer',
          notifications: { empty: 'empty' },
          games: { empty: 'empty' }
        });
      }
    });

    // Get all of the users
    // In the future this should be changed to get all of the friends
    usersRef = ref.child('users');
    usersList = $firebaseArray(usersRef);

    usersList.$loaded(function(data) {
      // Filter the date and remove you
      friendsList = data.filter(function(user) {
        if (user.uid !== $rootScope.user.uid) {
          return true;
        }
      });
    });
  };

  var check = function(isRedirectEnabled) {
    var authData = authObj.$getAuth();
    isRedirectEnabled = isRedirectEnabled || false;

    if (authData) {
      console.log("Logged in as:", authData.uid);
      if (isRedirectEnabled) {
        $location.path('/profile');
      }

      // Get the auth user
      var users = firebaseRef.child('users').child(authData.uid);
      var user = $firebaseObject(users);
      user.$loaded(function(data) {
        $rootScope.user = data;
        
        // Calculate some things
        $rootScope.user.progress = parseInt((data.xp / data.nextLevel) * 100);
      });
    } else {
      console.log("Logged out");
      $location.path('/login');
    }
  };

  var login = function(user) {

    // TODO: Validate the input

    var promise = authObj.$authWithPassword({
      email: user.email,
      password: user.password
    });

    //isNewUser = true;

    promise.then(function(authData) {
      console.log("Logged in as:", authData.uid);
      check(true);
    }).catch(function(error) {
      console.info("Authentication failed:", error);
    });

    return promise;
  };

  var logout = function() {
    authObj.$unauth();
    $location.path('/login');
  };

  var register = function(user) {

    // TODO: Check input
     
    isNewUser = true;

    var promise = authObj.$createUser({
      email: user.email,
      password: user.password
    });

    promise.then(function(userData) {
      console.log("User " + userData.uid + " created successfully!");

      login();
    }).then(function(authData) {
      console.log("Logged in as:", authData.uid);
    }).catch(function(error) {
      console.error("Error: ", error);
    });

    return promise;
  };

  var getFriends = function() {
    return friendsList;
  };

  var sendGameNotification = function(notification) {
    var receiverUid = notification.userTo;
    var receiverRef = firebaseRef.child('users').child(receiverUid).child('notifications');
    var receiver = $firebaseArray(receiverRef);
    receiver.$add(notification);
  };

  var addNewGame = function(userId, game) {
    var userRef = firebaseRef.child('users').child(userId).child('games');
    var user = $firebaseArray(userRef);
    user.$add(game);
  };

  var getPlayerFromUser = function(user) {
    var player = {
      uid:     user.uid,
      name:     user.name,
      level:    user.level,
      avatar:   user.avatar,
      badge:    user.badge
    };

    return player;
  };

  /**
   * Functin which is updating the xp and level of the player
   * Used when game is finished to recalculate the user stats
   * @param  {[type]} playerId       [description]
   * @param  {[type]} gainedXp       [description]
   * @param  {[type]} updateProgress [description]
   * @return {[type]}                [description]
   */
  var updatePlayerXp = function(playerId, gainedXp, updateProgress) {
    updateProgress = updateProgress || false;

    // Get the player
    var playerRef = usersList.$getRecord(playerId);

      playerRef.xp += gainedXp;
      playerRef.level = getLevelForXp(playerRef.xp);
      playerRef.nextLevel = getNextLevelXp(playerRef.level);

      if (updateProgress) {
        $rootScope.user.progress = parseInt((playerRef.xp / playerRef.nextLevel) * 100);
      }

      usersList.$save(playerRef);
  };

  function getName(authData) {
    switch(authData.provider) {
       case 'password':
         return authData.password.email.replace(/@.*/, '');
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
    }
  }

  // Levels constants
  var LEVELS_XP = {
    1: 1000,
    2: 2500,
    3: 5000,
    4: 7500,
    5: 10000,
    6: 15000,
    7: 21000,
    8: 27000,
    9: 35000,
    10: 35000,
  };

  var getLevelForXp = function(xp) {
    if (xp < LEVELS_XP[1])
      return 1;
    else if (xp < LEVELS_XP[2])
      return 2;
    else if (xp < LEVELS_XP[3])
      return 3;
    else if (xp < LEVELS_XP[4])
      return 4;
    else if (xp < LEVELS_XP[5])
      return 5;
    else if (xp < LEVELS_XP[6])
      return 6;
    else if (xp < LEVELS_XP[7])
      return 7;
    else if (xp < LEVELS_XP[8])
      return 8;
    else if (xp < LEVELS_XP[9])
      return 9;
    else if (xp >= LEVELS_XP[9])
      return 10;
  };

  var getNextLevelXp = function(level) {
    return LEVELS_XP[level];
  };

  return {
    init: init,
    check: check,
    login: login,
    logout: logout,
    register: register,

    getFriends: getFriends,

    sendGameNotification: sendGameNotification,
    addNewGame: addNewGame,

    getPlayerFromUser: getPlayerFromUser,
    updatePlayerXp: updatePlayerXp,
    getNextLevelXp: getNextLevelXp,
    getLevelForXp: getLevelForXp
  };
});