'use strict';

angular.module('myApp.view2', ['ui.router'])

.config(
  ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {

      // Use $stateProvider to configure your states.
      $stateProvider
        .state("view2", {

          url: "/view2",
          templateUrl: './view2/view2.html',
          controller: 'View2Ctrl'
        });

    }
  ]
)

.controller('View2Ctrl', [function() {

}]);