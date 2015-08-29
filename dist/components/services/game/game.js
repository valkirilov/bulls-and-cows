'use strict';

angular.module('myApp.services.game', [])
.factory('GameService', function ($rootScope, $http, ipCookie, $firebaseObject, $firebaseArray, $location, AuthService) {

  var firebaseRef,
      gamesList,
      gameObj;

  var init = function(ref) {
    firebaseRef = ref.child('games');
    gamesList = $firebaseArray(firebaseRef);

    gamesList.$loaded(function(data) {
      $rootScope.isGamesListLoaded = true;
      
      if ($rootScope.initGameAfterLoad) {
        $rootScope.initGame($rootScope.$state.params.gameId);
      }
    });

  };

  /**
   * Create a new game
   * @param  {[type]} game [description]
   * @return {[type]}      [description]
   */
  var newGame = function(game) {
    
    var emptyArray = [];
    emptyArray.push(1);

    game.players[1].attempts = game.players[2].attempts = emptyArray;

    var promise = gamesList.$add(game);

    promise.then(function(newGameRef) {

      var gameRef = newGameRef.key();
      game.id = gameRef;

      var notification = {
        userTo: game.players[2].uid,
        userFrom: game.players[1].uid,
        type: 'new-game',
        isRead: false,
        info: {
          gameId: gameRef
        }
      };
      AuthService.sendGameNotification(notification);

      var filteredGame = filterGame(game);
      
      AuthService.addNewGame(game.players[1].uid, filteredGame);
      AuthService.addNewGame(game.players[2].uid, filteredGame);

      $location.path('/game/multyplayer/' + gameRef );
    });
  };

  /**
   * Load a specific game by its id
   * @param  {[type]} gameId [description]
   * @return {[type]}        [description]
   */
  var loadGame = function(gameId) {
    var gameRef = gamesList.$getRecord(gameId);

    var game = {
      gameRef: gameRef
    };
    
    game.player = getPlayerPosition(gameRef);
    game.oponent = getOponentPosition(gameRef);
    game.isYourTurn = game.gameRef.turn === game.player;
    
    return game;
  };

  var updateGameState = function(game) {
    gamesList.$save(game);
  };

  /**
   * Calculate the end of the game
   * @param  {[type]} game [description]
   * @return {[type]}      [description]
   */
  var calculateEndOfGame = function(game) {

    game.gameRef.turn = 3;
    game.gameRef.winner = game.player;
    game.gameRef.status = 2;

    // Define some magic vars
    var winnerXpBonus = 600;
    var loserXpBonus = 200;

    // Calculate player xp gained
    var playerAttempts = game.gameRef.players[game.player].attempts.length,
        playerDifferenceInLevels = game.gameRef.players[game.oponent].level - game.gameRef.players[game.player].level,
        playerXpGained = winnerXpBonus + playerAttempts + ((playerDifferenceInLevels > 0) ? playerDifferenceInLevels * 50 : 0);

    // Calculate oponent xp gained
    var oponentAttempts = game.gameRef.players[game.oponent].attempts.length,
        oponentXpGained = loserXpBonus + oponentAttempts;

    game.gameRef.players[game.player].xpGained = playerXpGained;
    game.gameRef.players[game.oponent].xpGained = oponentXpGained;

    AuthService.updatePlayerXp(game.gameRef.players[game.player].uid, playerXpGained);
    AuthService.updatePlayerXp(game.gameRef.players[game.oponent].uid, oponentXpGained);

    return game;
  };

  var checkNumber = function(game, number) {
    var oponentNumber = game.gameRef.players[game.oponent].number.toString(),
        guessNumber = number.toString();

    var result = {
      bulls: 0,
      cows: 0
    };

    // Count the bulls
    if (guessNumber[0] == oponentNumber[0]) {
      result.bulls++;
      guessNumber = guessNumber.replaceAt(0, "x");
      oponentNumber = oponentNumber.replaceAt(0, "x");
    }
    if (guessNumber[1] == oponentNumber[1]) {
      result.bulls++;
      guessNumber = guessNumber.replaceAt(1, "x");
      oponentNumber = oponentNumber.replaceAt(1, "x");
    }
    if (guessNumber[2] == oponentNumber[2]) {
      result.bulls++;
      guessNumber = guessNumber.replaceAt(2, "x");
      oponentNumber = oponentNumber.replaceAt(2, "x");
    }
    if (guessNumber[3] == oponentNumber[3]) {
      result.bulls++;
      guessNumber = guessNumber.replaceAt(3, "x");
      oponentNumber = oponentNumber.replaceAt(3, "x");
    }
     
    // Count the cows
    var i, j, occurances, counted = [];
    for (i=0; i<guessNumber.length; i++) {
      if (guessNumber[i] === 'x')
        continue;

      if (counted.indexOf(guessNumber[i]) > -1)
        continue;

      j = 0;
      occurances = 0;
      for (j=0; j<oponentNumber.length; j++) {
        if (guessNumber[i] == oponentNumber[j]) {
          occurances++;
        }
      }
      result.cows += occurances;
    }
     
    return result;
  };

  var getPlayerPosition = function(game) {
    if (game.players[1].uid === $rootScope.user.uid) {
      return 1;
    }
    else if (game.players[2].uid === $rootScope.user.uid) {
      return 2;
    }
    return -1;
  };

  var getOponentPosition = function(game) {
    if (game.players[2].uid === $rootScope.user.uid) {
      return 1;
    }
    else if (game.players[1].uid === $rootScope.user.uid) {
      return 2;
    }
    return -1;
  };

  var filterGame = function(game) {
    return {
      id: game.id,
      players: {
        1: game.players[1],
        2: game.players[2],
      },
      status: game.status,
      winner: game.winner,
      turn: game.turn,
    };
  };

  String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
  };

  return {
    init: init,
    newGame: newGame,
    loadGame: loadGame,
    updateGameState: updateGameState,
    checkNumber: checkNumber,
    calculateEndOfGame: calculateEndOfGame,
  };
});