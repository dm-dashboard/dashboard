(function() {
    'use strict';
 
    angular.module('mean.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['messageService', '$timeout', '$window', '$scope', '$stateParams', '$rootScope'];

    var SIX_HOURS = 1000 * 60 * 60 * 6;
    function DashboardController(messageService, $timeout, $window, $scope, $stateParams, $rootScope) {
        var vm = this;

        activate();

        ///////////////////////////

        function activate() {
            $scope.timingConfig = {};
            vm.slideIndex = 0;
            vm.gridsize = {
                width: 1.0 / 40,
                height: 1.0 / 22
            };

            $timeout(function () {
                //Hopefully prevent script errors on the PI that seem to happen after running for about a day
                $window.location.reload();
            }, SIX_HOURS / 6);

            openSocketConnection();

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                pingServer();
            });
        }

        var setTimeoutForCurrentPage = function () {
            $timeout(function () {
                var oldIndex = vm.slideIndex;
                vm.slideIndex++;
                $timeout(function () {
                    //Did not increment, so reset carousel
                    if (oldIndex === vm.slideIndex) {
                        vm.slideIndex = 0;
                    }
                }, 500);
                setTimeoutForCurrentPage();
            }, $scope.timingConfig[vm.slideIndex] * 1000);

        };

        $scope.$watch('timingConfig', function (newValue) {
            setTimeoutForCurrentPage();
        });

        function messageReceived(message) {
            messageService.messageReceived(message);
            $scope.$apply();
        };

        function pingServer() {
            vm.socket.emit('boot', {
                dashboard: $stateParams.dashboardId
            });
        }

        function openSocketConnection() {
            var socket = window.io.connect('');
            vm.socket = socket;
            socket.on('init', function (data) {
                socket.on('message', messageReceived);
                pingServer();
                messageService.socketConnected(socket);
            });
        }
    }

})();