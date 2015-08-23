'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("view1", {

          url: "/",
          templateUrl: './view1/view1.html',
          controller: 'View1Ctrl'
        });

    }
  ]
)

.controller('View1Ctrl', [function() {

}]);