'use strict';

angular.module('myApp.profile', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("login", {
          url: "/login",
          templateUrl: './profile/login.html',
          controller: 'ProfileCtrl'
        })
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

  $scope.login = function() {

    var user = {
      email: angular.copy($scope.loginInput.email),
      password: angular.copy($scope.loginInput.password),
    };

    var promise = AuthService.login(user);
  };

  init();

}]);