'use strict';

angular.module('myApp.services.auth', [])
.factory('AuthService', function ($http, ipCookie, $firebaseAuth, $firebaseArray, $firebaseObject, $location, $rootScope) {

  var firebaseRef,
      usersRef,
      authObj,
      usersList;

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
      //console.log(data);
    });
  };

  var check = function() {
    var authData = authObj.$getAuth();

    if (authData) {
      console.log("Logged in as:", authData.uid);
      $location.path('/profile');

      // Get the auth user
      var users = firebaseRef.child('users').child(authData.uid);
      var user = $firebaseObject(users);
      user.$loaded(function(data) {
        $rootScope.user = data;
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
      check();
    }).catch(function(error) {
      console.error("Authentication failed:", error);
      alert(error);
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
    return usersList;
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

  return {
    init: init,
    check: check,
    login: login,
    logout: logout,
    register: register,

    getFriends: getFriends,

    sendGameNotification: sendGameNotification,
    addNewGame: addNewGame,

    getPlayerFromUser: getPlayerFromUser
  };
});