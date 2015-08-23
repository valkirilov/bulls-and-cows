'use strict';

angular.module('myApp.services.game', [])
.factory('GameService', function ($http, ipCookie, $firebaseObject, $firebaseArray, $location, AuthService) {

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
    console.log(game);
    var promise = gamesList.$add(game);

    promise.then(function(newGameRef) {

      var gameRef = newGameRef.key();

      var notification = {
        userTo: game.player2.uid,
        userFrom: 'me',
        type: 'new-game',
        isRead: false,
        info: {
          gameId: gameRef
        }
      };
      AuthService.sendGameNotification(notification);

      $location.path('/game/multyplayer/' + gameRef );
    });
  };

  return {
    init: init,
    newGame: newGame
  };
});