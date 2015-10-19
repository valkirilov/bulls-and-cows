'use strict';

angular.module('myApp.game', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("game-new", {
          url: "/game/new",
          templateUrl: './scripts/game/new.html',
          controller: 'GameCtrl'
        })
        .state("game-multyplayer", {
          url: "/game/multyplayer/{gameId:[a-zA-Z0-9_-]+}",
          templateUrl: './scripts/game/multyplayer.html',
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

    if ($rootScope.$state.current.name === 'game-multyplayer') {
      // If we are on a route with a game param we should load it
      if ($rootScope.isGamesListLoaded) {
        // If the app is already loaded and the list of games is fetched, load the current game
        $rootScope.initGame($rootScope.$state.params.gameId);
      }
      else {
        // If this is the first init of the controller, we should wait for the loading of the games
        $rootScope.initGameAfterLoad = true;
      }
    }
  };

  $scope.checkNewGameNumberInput = function(input) {
    if (isNumberValid($scope[input].number)) {
      $scope[input].isNumberValid = true;
    }
    else {
      $scope[input].isNumberValid = false; 

    }
  };

  $scope.visible = true;
  $scope.test = function() {
    $scope.visible = !$scope.visible;
    console.log($scope.visible);
  };

  /**
   * Chooseing player from the suggestions list
   * @param  {[type]} player [description]
   * @return {[type]}        [description]
   */
  $scope.choosePlayer = function(player) {
    $scope.newGame.oponent = player.name;
    $scope.selectedPlayer(player);
  };

  /**
   * Check the validity of the entered player
   * @return {[type]} [description]
   */
  $scope.checkPlayer = function() {
    var isValid = false;

    $scope.friendsList.forEach(function(friend) {
      if ($scope.newGame.oponent === friend.name) {
        isValid = true;
      }
    });

    $scope.newGame.isOponentValid = isValid;
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
    player1.number = $scope.newGame.number;

    $scope.newGame.players[1] = player1;
    $scope.newGame.winner = 0;
    $scope.newGame.turn = 0;

    // Unset some variables
    delete $scope.newGame.number;
    delete $scope.newGame.isNumberValid;
    delete $scope.newGame.isOponentValid;
    delete $scope.newGame.oponent;

    GameService.newGame($scope.newGame);
  };

  /**
   * Accept and start a game when the second players enter number
   * @param  {[type]} game       [description]
   * @param  {[type]} acceptGame [description]
   * @return {[type]}            [description]
   */
  $scope.acceptNewGame = function(game, acceptGame) {
    game.gameRef.status = 1;
    game.gameRef.turn = 2;

    // Set the number of player 2, the accepter
    game.gameRef.players[2].number = acceptGame.number;
    GameService.updateGameState(game.gameRef);
  };

  $scope.checkNumber = function(game, number) {

    if (!isNumberValid(number)) {
      return;
    }

    // Get the rsult of this number
    var result = GameService.checkNumber(game, number);

    //Add the new attempt
    var attempt = {
      number: number,
      result: result
    };
    game.gameRef.players[game.player].attempts.push(attempt);
    game.gameRef.turn = game.oponent;

    $scope.checkNumberInput = '';

    // Check is the attemp fully correct
    if (result.bulls === 4) {
      console.log('Winner');
      game = GameService.calculateEndOfGame(game);
    }

    GameService.updateGameState(game.gameRef);
  };

  $rootScope.initGame = function(gameId) {
    $scope.game = GameService.loadGame(gameId); 
  };

  //$scope.$on('$viewContentLoaded', function(param1, param2) {
  $scope.$on('$routeChangeSuccess', function(param1, param2) {
    if ($rootScope.$state.current.name === 'game-multyplayer') {
      $rootScope.initGame($rootScope.$state.params.gameId);
    }
  });

  var isNumberValid = function(number) {
    if (number.toString().length === 4 && isNumeric(number)) {
      return true;
    }
    else {
      return false;
    }
  };

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  init();

}]);