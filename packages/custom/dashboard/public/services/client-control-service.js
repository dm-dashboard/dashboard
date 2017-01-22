(function () {
    'use strict';

    angular.module('mean.dashboard')
        .factory('clientControlService', ClientControlService);

    ClientControlService.$inject = ['$http', '$q'];

    function ClientControlService($http, $q) {
        var service = {};

        service.identify = identifyClient;
        service.forceReload = forceReload;
        service.rename = renameClient;
        service.setDefault = setDefault;
        service.getConnectedClients = getConnectedClients;
        service.saveBroadcast = saveBroadcast;
        service.cancelBroadcast = cancelBroadcast;
        service.listBroadcasts = listBroadcasts;


        function identifyClient(client) {
            var body = {
                socketId: client.uniqueId,
                text: client.name
            };
            return $http.post('/dashboard/admin/identify', body);

        }

        function forceReload(client) {
            var body = {};
            if (client) {
                body.socketId = client.uniqueId;
            }
            return $http.post('/dashboard/admin/forceRefresh', body);
        }

        function getConnectedClients() {
            return $http.get('/dashboard/admin/clients')
                .then(function (response) {
                    return response.data;
                });
        }

        function renameClient(client, newName) {
            var body = {
                client: client.ip,
                newName: newName
            };
            return $http.post('/dashboard/admin/rename', body);
        }
        
        function setDefault(client, newDefaultDashboardId) {
            var body = {
                client: client.ip,
                newDefault: newDefaultDashboardId
            };
            return $http.post('/dashboard/admin/default', body);
        }
        
        function listBroadcasts(){
            return $http.get('/dashboard/admin/broadcasts')
            .then(function(response){
                return response.data;
            });
        }
        
        function saveBroadcast(broadcastConfig){
            return $http.post('/dashboard/admin/broadcast', broadcastConfig);
        }
        
        function cancelBroadcast(broadcastConfig){
            return $http.delete('/dashboard/admin/broadcast/' + broadcastConfig._id);
        }

        return service;
    }

})();
