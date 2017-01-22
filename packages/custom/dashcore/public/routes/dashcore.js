'use strict';

angular.module('mean.dashcore').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('dashcore example page', {
      url: '/dashcore/example',
      templateUrl: 'dashcore/views/index.html'
    });
  }
]);
