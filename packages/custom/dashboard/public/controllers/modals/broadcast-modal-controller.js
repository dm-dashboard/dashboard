(function () {
    'use strict';

    angular.module('mean.dashboard')
        .controller('BroadcastModalController', BroadcastModalController);

    BroadcastModalController.$inject = ['$q', '$scope', '$modalInstance', 'clients', 'dashboards', 'edit'];

    function BroadcastModalController($q, $scope, $modalInstance, clients, dashboards, edit) {
        var modal = this;

        var allClientsTag = {
            name: 'All Clients',
            _id: '__all__'
        };

        modal.dateOptions = {};
        modal.clients = clients;

        modal.dashboards = dashboards;
        modal.broadcast = angular.copy(edit);
        modal.ok = ok;
        modal.cancel = cancel;
        modal.open = open;
        modal.getClients = getClients;

        activate();
        
        ///////////////////////////////////////

        function activate() {
            if (modal.broadcast.allClients) {
                modal.broadcast.clients = [allClientsTag];
            } else {
                angular.forEach(modal.broadcast.clients, function (client) {
                    client.name = modal.clients.filter(function (fullClientDetails) {
                        return fullClientDetails.ip = client.ip;
                    })[0].name;
                });
            }
        }

        function ok() {
            $modalInstance.close(modal.broadcast);
        };

        function cancel() {
            $modalInstance.dismiss();
        };

        function open($event, time) {
            $event.preventDefault();
            $event.stopPropagation();

            modal[time + 'Opened'] = true;
        };

        function getClients(query) {
            var deferred = $q.defer();
            var result = modal.clients.filter(function (client) {
                return client.name.toLowerCase().indexOf(query.toLowerCase()) === 0;
            });
            result.unshift(allClientsTag);
            deferred.resolve(result);
            return deferred.promise;
        }


    }
})();
