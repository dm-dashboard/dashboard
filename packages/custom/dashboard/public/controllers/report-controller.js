'use strict';

angular.module('mean.dashboard')
    .controller('ReportController', ['$scope', 'Global', 'Dashboard','messageService','$timeout','$interval',
        function($scope, Global, Dashboard,messageService, $timeout, $interval) {
            $scope.global = Global;
            $scope.package = {
                name: 'dashboard'
            };

            var messageReceived = function(message){
                console.log(message);
                messageService.messageReceived(message);
                $scope.$apply();
            };

            var socket = window.io.connect('');
            socket.on('init', function (data) {
                socket.on('message',messageReceived);
                messageService.socketConnected(socket);
            });


        }
    ]);

