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

    $scope.isLogging = true;
    $scope.loginError = {};

    var user = {
      email: angular.copy($scope.loginInput.email),
      password: angular.copy($scope.loginInput.password),
    };

    var promise = AuthService.login(user);

    promise.then(function(authData) {
      $scope.isLogging = false;
    }, function(error) {
      $scope.isLogging = false;
      if (error === 'INVALID_EMAIL') {
        $scope.loginError.email = true;
      } else if (error === 'INVALID_PASSWORD') {
        $scope.loginError.password = true;
      } else {
        $scope.loginError.other = '' + error;

        if ($scope.loginError.other.indexOf('email') > -1 || $scope.loginError.other.indexOf('user') > -1) {
          $scope.loginError.email = true;
        }
        if ($scope.loginError.other.indexOf('password') > -1) {
          $scope.loginError.password = true;
        }
      }
    });
  };

  init();

}]);