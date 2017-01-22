(function () {
    'use strict';


    angular.module('mean.dashboard')
        .controller('DashboardAdminModalController', DashboardAdminModalController);

    function DashboardAdminModalController($scope, $modalInstance, dashboard, plugins, getWidgetsFunction) {
        var vm = this;
        var widgetListCache = {};
        vm.colors = [];

        vm.widgetsForPage = getWidgetsForPage;
        vm.removeWidget = removeWidget;
        vm.addWidget = addWidget;
        vm.addPage = addPage;
        vm.removePage = removePage;
        vm.changePage = changePage;
        vm.save = saveDashboard;
        vm.cancel = closeModal;

        $scope.$watch('modal.selectedPlugin', function () {
            getWidgets();
            vm.selectedWidget = null;
        });

        activate();

        /////////////////////////////////////////////////////////////////////////////////////

        function activate() {
            vm.selectedPage = 0;
            vm.gridsterOpts = {
                // the pixel distance between each widget
                margins: [1, 1],
                columns: 40,
                maxRows: 22,
                resizable: {
                    enabled: true,
                    handles: 'n, e, s, w, ne, se, sw, nw'
                }
            };

            vm.currentDashboard = dashboard;
            vm.plugins = plugins;
            vm.widgetSelected = false;
            generateColors();
        }

        function getWidgetsForPage() {
            if (vm.selectedPage >= vm.currentDashboard.pages.length) {
                vm.selectedPage = vm.currentDashboard.pages.length - 1;
            }
            return vm.currentDashboard.pages[vm.selectedPage].widgets;
        }


        function removeWidget(widget) {
            var page = vm.currentDashboard.pages[vm.selectedPage];
            var widgetIndex = -1;
            var index = 0;
            angular.forEach(page.widgets, function (widgetOnPage) {
                if (angular.equals(widget, widgetOnPage)) {
                    widgetIndex = index;
                }
                index++;
            });
            page.widgets.splice(widgetIndex, 1);
        }

        function addWidget() {
            var newWidget = {
                "name": vm.selectedWidget.name,
                "directive": vm.selectedWidget.directive,
                "sizeX": 8,
                "sizeY": 8,
                "row": 0,
                "col": 33
            };
            vm.currentDashboard.pages[vm.selectedPage].widgets.push(newWidget);
        }

        function spreadPages() {
            angular.forEach(vm.currentDashboard.pages, function (page) {
                page.percentageOfCycle = 100 / vm.currentDashboard.pages.length;
            });
        }

        function addPage() {
            var newPagePercentage = 10;
            var currentTotal = vm.currentDashboard.pages.reduce(function (total, page) {
                return total + page.percentageOfCycle;
            }, 0);
            if (currentTotal + newPagePercentage > 100) {
                angular.forEach(vm.currentDashboard.pages, function (page) {
                    page.percentageOfCycle -= (newPagePercentage / vm.currentDashboard.pages.length);
                })
            }
            vm.currentDashboard.pages.push({
                widgets: [],
                percentageOfCycle: newPagePercentage
            });

            vm.selectedPage = vm.currentDashboard.pages.length - 1;
        }

        function removePage() {
            var toReassign = vm.currentDashboard.pages[vm.selectedPage].percentageOfCycle;
            vm.currentDashboard.pages.splice(vm.selectedPage, 1);
            angular.forEach(vm.currentDashboard.pages, function (page) {
                page.percentageOfCycle += (toReassign / vm.currentDashboard.pages.length);
            })
        }

        function changePage(difference) {
            vm.selectedPage += difference;
        }

        function padLeftHex(number) {
            return ('00' + number.toString(16)).slice(-2);
        }

        function generateColors() {
            var mixColor = {
                red: 50,
                green: 0,
                blue: 127
            };

            for (var i = 0; i < 32; i++) {
                var newColor = {
                    red: Math.floor(((Math.random() * 256) + mixColor.red) / 2),
                    green: Math.floor(((Math.random() * 256) + mixColor.green) / 2),
                    blue: Math.floor(((Math.random() * 256) + mixColor.blue) / 2)
                };
                var colorCode = '#' + padLeftHex(newColor.red) + padLeftHex(newColor.green) + padLeftHex(newColor.blue);
                vm.colors.push(colorCode);
            }
        }


        function getWidgets() {
            if (!vm.selectedPlugin) {
                return;
            }
            var plugin = vm.selectedPlugin.name;
            getWidgetsFunction(plugin)
                .then(function (widgets) {
                    vm.pluginWidgets = widgets;
                });
        }

        function saveDashboard() {
            $modalInstance.close(vm.currentDashboard);
        }

        function closeModal() {
            $modalInstance.dismiss();
        }
    }
}());
