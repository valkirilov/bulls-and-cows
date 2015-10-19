'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngCookies',
  'ngAnimate',

  'myApp.guest',
  'myApp.profile',
  'myApp.game',
  'myApp.version',
  'myApp.services',

  //'restangular',
  'firebase',
  'ui.bootstrap',
  'ipCookie',
  //'chieffancypants.loadingBar',
  'gettext',
])

.controller('GlobalController', ['$scope', '$rootScope', '$location', 'gettextCatalog', '$firebaseAuth', 'AuthService', 'GameService',
  function($scope, $rootScope, $location, gettextCatalog, $firebaseAuth, AuthService, GameService) {

  $scope.lang = "en";

  $rootScope.firebaseRefURL = "https://bulls-and-cows-game.firebaseio.com/";
  $rootScope.firebaseRef = null;

  $rootScope.user = null;
  $rootScope.isGamesListLoaded = false;

  var init = function() {
    $rootScope.firebaseRef = new Firebase($rootScope.firebaseRefURL);

    AuthService.init($rootScope.firebaseRef);
    AuthService.check();

    GameService.init($rootScope.firebaseRef);
  };

  $scope.setLanguage = function(language) {
    $scope.lang = language;
    gettextCatalog.currentLanguage = language;
  };

  $scope.logout = function() {
    AuthService.logout();
  };

  init();

}])

.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      /////////////////////////////
      // Redirects and Otherwise //
      /////////////////////////////
      ///
      $urlRouterProvider.otherwise('/');

      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.

    }
  ]
);
