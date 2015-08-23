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

  $scope.checkNewGameNumberInput = function() {
    if (isNumberValid($scope.newGame.number1) &&
      isNumberValid($scope.newGame.number2) &&
      isNumberValid($scope.newGame.number3) &&
      isNumberValid($scope.newGame.number4)) {
      $scope.newGame.isNumberValid = true;
    }
    else {
      $scope.newGame.isNumberValid = false; 

    }
  };

  $scope.selectedPlayer = function(player) {
    $scope.newGame.isOponentValid = true;
    $scope.newGame.player2 = player;
  };
  $scope.startNewGame = function() {
    $scope.newGame.status = 0;
    $scope.player1 = 'test';

    GameService.newGame($scope.newGame);
  };

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