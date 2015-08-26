'use strict';

angular.module('myApp.guest', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("login", {
          url: "/login",
          templateUrl: './guest/login.html',
          controller: 'GuestCtrl'
        });
    }
  ]
)

.controller('GuestCtrl', ['$rootScope', '$scope', 'AuthService', function($rootScope, $scope, AuthService) {

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