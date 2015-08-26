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
      console.log(data);
    });

  };

  var newGame = function(game) {
    
    var emptyArray = [];
    emptyArray.push(1);

    game.players[1].attempts = game.players[2].attempts = emptyArray;

    console.log(game);

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

  var loadGame = function(gameId) {
    var gameRef = gamesList.$getRecord(gameId);

    var game = {
      gameRef: gameRef
    };

    //gamesList.$save(game);
    
    game.player = getPlayerPosition(gameRef);
    game.oponent = getOponentPosition(gameRef);
    game.isYourTurn = game.gameRef.turn === game.player;
    
    console.log(game);
    return game;
  };

  var updateGameState = function(game) {
    gamesList.$save(game);
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

  return {
    init: init,
    newGame: newGame,
    loadGame: loadGame,
    updateGameState: updateGameState
  };
});