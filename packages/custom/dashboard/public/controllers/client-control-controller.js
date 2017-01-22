/* global angular */
(function () {
    'use strict';

    angular.module('mean.dashboard')
        .controller('ClientControlController', ClientControlController);

    ClientControlController.$inject = ['notifications', '$modal', 'dashboardAdminService', 'clientControlService'];

    function ClientControlController(notifications, $modal, dashboardAdminService, clientControlService) {
        var vm = this;

        vm.setDefault = setDefault;
        vm.identify = identify;
        vm.forceReload = forceReload;
        vm.timeAgo = timeAgo;
        vm.getConnectedClients = getConnectedClients;
        vm.getBroadcasts = getBroadcasts;
        vm.rename = rename;
        vm.addEditBroadcast = addEditBroadcast;
        vm.cancelBroadcast = cancelBroadcast;
        vm.formatBroadcastClients = formatBroadcastClients;

        activate();
        
        ////////////////////////////////////////////////////////////    
                        
        function activate() {
            getConnectedClients();
            getBroadcasts();
        }

        function identify(client) {
            clientControlService.identify(client)
                .then(function (response) {
                    notifications.success('Identification request sent to ' + client.name);
                })
                .catch(function (error) {
                    notifications.error('Identification request could not be sent to client',error);
                })
        };

        function forceReload(client) {
            clientControlService.forceReload(client)
                .then(function (response) {
                    notifications.success('Reload message sent to ' + (client ? client.name : ' all clients'));
                })
                .catch(function (response) {
                    notifications.error('Reload message could not be sent to client(s)',error);
                });
        };

        function timeAgo(dateString) {
            return window.moment(new Date(dateString)).fromNow();
        };

        function getConnectedClients() {
            clientControlService.getConnectedClients()
                .then(function (clients) {
                    vm.clients = clients;
                })
                .catch(function (error) {
                    notifications.error('Could not load clients',error);
                });
        };
        
        function getBroadcasts() {
            clientControlService.listBroadcasts()
                .then(function (broadcasts) {
                    vm.broadcasts = broadcasts;
                })
                .catch(function (error) {
                    notifications.error('Could not load broadcasts',error);
                });
        };

        function rename(client) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'dashboard/views/modals/client-name-modal.html',
                controller: 'ClientNameModalController as modal',
                resolve: {
                    client: function () {
                        return client;
                    }
                }
            });

            modalInstance.result.then(function (newName) {
                clientControlService.rename(client, newName)
                    .then(function (response) {
                        notifications.success('Client successfully renamed');
                        client.name = newName;
                    })
                    .catch(function (error) {
                        notifications.error('Could not rename client',error);
                    });
            });
        };

        function setDefault(client) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'dashboard/views/modals/client-default-modal.html',
                controller: 'ClientDefaultModalController as modal',
                resolve: {
                    client: function () {
                        return client;
                    },
                    dashboards : function(){
                        return dashboardAdminService.getDashboards();
                    }
                }
            });

            modalInstance.result.then(function (newDefaultId) {
                clientControlService.setDefault(client, newDefaultId)
                    .then(function (response) {
                        notifications.success('Client default successfully set');
                        client.defaultDashboard = newDefaultId;
                    })
                    .catch(function (error) {
                        notifications.error('Could not set client default',error);
                    });
            });
        }
        
        function addEditBroadcast(broadcast) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'dashboard/views/modals/broadcast-modal.html',
                controller: 'BroadcastModalController as modal',
                resolve: {
                    clients: function () {
                        return vm.clients;
                    },
                    dashboards : function(){
                        return dashboardAdminService.getDashboards();
                    },
                    edit : function(){
                        return broadcast || {
                            startTime : new Date(),
                            endTime : new Date(),
                            clients : [],
                            dashboard : 'default'                            
                        };
                    }
                    
                }
            });

            modalInstance.result.then(function (broadcastConfig) {
                clientControlService.saveBroadcast(broadcastConfig)
                    .then(function (response) {
                        notifications.success('Broadcast saved');
                        angular.copy(broadcast, response.data);
                        activate();
                    })
                    .catch(function (error) {
                        notifications.error('Could not save broadcast',error);
                    });
            });
        }
        
        function cancelBroadcast(broadcast) {
            var modalInstance = $modal.open({
                animation: true,
                size: 'sm',
                templateUrl: 'dashboard/views/modals/cancel-broadcast-modal.html',
                controller: 'CancelBroadcastModalController as modal',
                resolve: {
                    broadcast: function () {
                        return broadcast;
                    }
                }
            });

            modalInstance.result
                .then(function () {
                    return clientControlService.cancelBroadcast(broadcast);
                })
                .then(function (response) {
                    notifications.success('Broadcast cancelled');
                    activate();
                })
                .catch(function (error) {
                    if (error) {
                        notifications.error('Could not cancel broadcast.',error);
                    }
                });
        }
        
        function getClientByIp(ip) {
            return vm.clients.filter(function(client){
                return client.ip === ip;
            })[0];
        }
        
        function formatBroadcastClients(broadcast){
            if (broadcast.allClients){
                return 'All Clients';
            }
            var clientLine = broadcast.clients.reduce(function(oneLine, client){
                return oneLine + getClientByIp(client.ip).name + ',';
            },'');;
            if (clientLine.length > 1){
                clientLine = clientLine.substring(0,clientLine.length -1);
            }
            return clientLine;            
        }
    };


})();