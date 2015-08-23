'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngCookies',

  'myApp.view1',
  'myApp.view2',
  'myApp.version',

  //'restangular',
  'ui.bootstrap',
  //'chieffancypants.loadingBar',
  'gettext',
])

.controller('GlobalController', ['$scope', '$rootScope', '$location', 'gettextCatalog',
  function($scope, $rootScope, $location, gettextCatalog) {

  $scope.lang = "en";

  $scope.setLanguage = function(language) {
    $scope.lang = language;
    gettextCatalog.currentLanguage = language;
  };

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
