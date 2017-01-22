(function(){
    'use strict';

    angular.module('mean.dashboard')
        .controller('ClientNameModalController', ClientNameModalController);

    function ClientNameModalController($modalInstance, client){
        var modal = this;
        modal.client = angular.copy(client);

        modal.ok = function(){
            $modalInstance.close(modal.client.name);
        };

        modal.cancel = function(){
            $modalInstance.dismiss();
        };
    }




})();
