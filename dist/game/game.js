'use strict';

angular.module('myApp.game', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("game-new", {
          url: "/game/new",
          templateUrl: './game/new.html',
          controller: 'GameCtrl'
        })
        .state("game-multyplayer", {
          url: "/game/multyplayer/{gameId:[a-zA-Z0-9_-]+}",
          templateUrl: './game/multyplayer.html',
          controller: 'GameCtrl'
        })
        ;
    }
  ]
)

.controller('GameCtrl', ['$rootScope', '$scope', '$stateParams', 'AuthService', 'GameService', function($rootScope, $scope, $stateParams, AuthService, GameService) {

  $scope.friendsList = null;

  var init = function() {
    $scope.friendsList = AuthService.getFriends();
  };

  $scope.checkNewGameNumberInput = function(input) {
    if (isNumberValid($scope[input].number1) &&
      isNumberValid($scope[input].number2) &&
      isNumberValid($scope[input].number3) &&
      isNumberValid($scope[input].number4)) {
      $scope[input].isNumberValid = true;
    }
    else {
      $scope[input].isNumberValid = false; 

    }
  };

  $scope.selectedPlayer = function(player) {
    $scope.newGame.isOponentValid = true;
    var player2 = AuthService.getPlayerFromUser(player);
    $scope.newGame.players = {
      1: null,
      2: player2
    };
  };
  $scope.startNewGame = function() {
    $scope.newGame.status = 0;
    
    // Set player 1, the host
    var player1 = AuthService.getPlayerFromUser($rootScope.user); 
    player1.number = {
      number1: $scope.newGame.number1,
      number2: $scope.newGame.number2,
      number3: $scope.newGame.number3,
      number4: $scope.newGame.number4
    };

    $scope.newGame.players[1] = player1;
    $scope.newGame.winner = 0;
    $scope.newGame.turn = 0;

    // Unset some variables
    delete $scope.newGame.number1;
    delete $scope.newGame.number2;
    delete $scope.newGame.number3;
    delete $scope.newGame.number4;

    delete $scope.newGame.isNumberValid;
    delete $scope.newGame.isOponentValid;
    delete $scope.newGame.oponent;

    GameService.newGame($scope.newGame);
  };

  $scope.acceptNewGame = function(game, number) {
    console.log(game);

    game.gameRef.status = 1;
    game.gameRef.turn = 2;

    // Set the number of player 2, the accepter
    game.gameRef.players[2].number = {
      number1: number.number1,
      number2: number.number2,
      number3: number.number3,
      number4: number.number4
    };

    GameService.updateGameState(game.gameRef);
  };

  $scope.checkNumber = function(game, number) {
    //Add the new attempt
    var attempt = {
      number: number,
      result: 'soon'
    };
    game.gameRef.players[game.player].attempts.push(attempt);
    game.gameRef.turn = game.oponent;

    $scope.checkNumberInput = '';


    console.log(game);

    GameService.updateGameState(game.gameRef);
  };

  $scope.initGame = function(gameId) {
    $scope.game = GameService.loadGame(gameId); 
  };

  $scope.$on('$viewContentLoaded', function(param1, param2){
    if ($rootScope.$state.current.name === 'game-multyplayer') {
      $scope.initGame($rootScope.$state.params.gameId);
    }
  });

  var isNumberValid = function(number) {
    if (number >= 1 && number <=9) {
      return true;
    }
    else {
      return false;
    }
  };

  init();

}]);