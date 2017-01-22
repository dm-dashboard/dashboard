(function(){
    'use strict';

    angular.module('mean.dashboard')
        .controller('DeleteDashboardModalController', DeleteDashboardModalController);

    function DeleteDashboardModalController($scope, $modalInstance, dashboard){
        var modal = this;
        modal.dashboard = dashboard;

        modal.ok = function(){
            $modalInstance.close(true);
        };

        modal.cancel = function(){
            $modalInstance.dismiss();
        };
    }




})();
