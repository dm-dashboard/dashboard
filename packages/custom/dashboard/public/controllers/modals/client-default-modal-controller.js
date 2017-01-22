(function(){
    'use strict';

    angular.module('mean.dashboard')
        .controller('ClientDefaultModalController', ClientDefaultModalController);

    ClientDefaultModalController.$inject = ['$scope', '$modalInstance', 'client', 'dashboards'];

    function ClientDefaultModalController($scope, $modalInstance, client, dashboards) {
        $scope.client = client;
        var modal = this;
        modal.client = angular.copy(client);
        modal.dashboards = dashboards;

        modal.ok = function(){
            $modalInstance.close(modal.client.defaultDashboard);
        };

        modal.cancel = function(){
            $modalInstance.dismiss();
        };
    }
})();
