'use strict';

angular.module('myApp.profile', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("logout", {
          url: "/logout",
          templateUrl: './profile/logout.html',
          controller: 'ProfileCtrl'
        })
        .state("profile", {
          url: "/profile",
          templateUrl: './profile/profile.html',
          controller: 'ProfileCtrl'
        });
    }
  ]
)

.controller('ProfileCtrl', ['$rootScope', '$scope', 'AuthService', function($rootScope, $scope, AuthService) {

  var init = function() {

  };

  init();

}]);