'use strict';

/* jshint -W098 */
angular.module('mean.dashcore').controller('DashcoreController', ['$scope', 'Global', 'Dashcore',
  function($scope, Global, Dashcore) {
    $scope.global = Global;
    $scope.package = {
      name: 'dashcore'
    };
  }
]);
