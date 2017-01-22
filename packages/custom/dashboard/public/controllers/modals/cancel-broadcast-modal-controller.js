(function(){
    'use strict';

    angular.module('mean.dashboard')
        .controller('CancelBroadcastModalController', CancelBroadcastModalController);

    function CancelBroadcastModalController($scope, $modalInstance, broadcast){
        var modal = this;
        modal.broadcast = broadcast;

        modal.ok = function(){
            $modalInstance.close(true);
        };

        modal.cancel = function(){
            $modalInstance.dismiss();
        };
    }




})();
