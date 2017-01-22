(function () {
    'use strict';

    angular.module('mean.dashboard')
        .factory('messageService', MessageService);

    MessageService.$inject = ['$rootScope', '$q', '$window', '$location', '$timeout'];

    function MessageService($rootScope, $q, $window, $location, $timeout) {
        var service = this;

        service.registerPlugin = registerPlugin;
        service.unRegisterPlugin = unRegisterPlugin;
        service.messageReceived = messageReceived;
        service.socketConnected = socketConnected;
        service.ready = ready;
        service.sendMessage = sendMessage;

        var waitingForSocket = $q.defer();
        var plugins = {
            _SYSTEM_: handleSystemMessage
        };
        var readyPlugins = {};
        var _socket;

        function handleSystemMessage(message) {
            switch (message.command) {
                case 'refresh':
                    $window.location.reload();
                    break;
                case 'identify':
                    $rootScope.$emit('identify', message.text);
                    break;
                case 'changeDashboard':
                    $timeout(function () {
                        $location.path('dashboard/' + message.dashboardId)
                    }, 100);

                    break;
            }
        };

        function registerPlugin(name, callback) {
            plugins[name] = callback;
            readyPlugins[name] = false;
            waitingForSocket.promise.then(function () {
                if (plugins[name]) {
                    service.sendMessage(name, { command: 'init' });
                }
            });
        }

        function unRegisterPlugin(tag) {
            if (plugins[name]) {
                delete plugins[name];
            }
            if (readyPlugins[name]) {
                delete readyPlugins[name];
            }
        }

        function messageReceived(message) {
            console.log('New message received from [' + message.name + ']')
            console.log(message.payload);
            console.log('------------------------------------------------------')
            if (plugins[message.name]) {
                plugins[message.name](message.payload);
            }
        }

        function socketConnected(socket) {
            _socket = socket;
            waitingForSocket.resolve();
        }

        function ready(name) {
            readyPlugins[name] = true;
        }


        function sendMessage(to, message, waitForConnection) {
            if (!_socket && (waitForConnection !== undefined && !waitForConnection)) {
                return;
            }
            waitingForSocket.promise.then(function () {
                console.log('Sending message to [' + to + ']')
                console.log(message);
                console.log('------------------------------------------------------')
                _socket.emit('message', {
                    name: to,
                    payload: message
                });
            });
        }

        $rootScope.allPluginsReady = function () {
            for (var plugin in readyPlugins) {
                if (!readyPlugins[plugin]) {
                    return false;
                }
            }
            return true;
        };

        return service;

    };
})();
