(function () {
    'use strict';

    angular.module('mean.dashboard')
        .controller('DashboardAdminController', DashboardAdminController);

    DashboardAdminController.$inject = ['dashboardAdminService', 'notifications', '$modal', '$q'];


    function DashboardAdminController(dashboardAdminService, notifications, $modal, $q) {
        var vm = this;

        activate();

        vm.addDashboard = addDashboard;
        vm.editDashboard = editDashboard;
        vm.deleteDashboard = deleteDashboard;
        vm.secondsPerPage = secondsPerPage;

        //////////////////////////////////////////////////////////////////////////

        function activate() {
            dashboardAdminService.getPlugins()
                .then(function (plugins) {
                    vm.plugins = plugins;
                })
                .catch(function (error) {
                    notifications.error('Could not load plugins',error);
                });

            dashboardAdminService.getDashboards()
                .then(function (dashboards) {
                    vm.allDashboards = dashboards;
                    angular.forEach(vm.allDashboards, function (dashboard) {
                        dashboard.setPageSeconds = function (index, value) {
                            dashboard.pages[index].percentageOfCycle = value;
                        };
                    });
                })
                .catch(function (error) {
                    notifications.error('Could not load all dashboards',error);
                });
        }

        function editDashboard(dashboard) {
            var modalInstance = $modal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'dashboard/views/modals/dashboard-admin-modal.html',
                controller: 'DashboardAdminModalController as modal',
                resolve: {
                    dashboard: function () {
                        return angular.copy(dashboard);
                    },
                    plugins: function () {
                        return vm.plugins;
                    },
                    getWidgetsFunction: function () {
                        return dashboardAdminService.getWidgets;
                    }
                }
            });

            modalInstance.result
                .then(function (savedDashboard) {
                    return dashboardAdminService.saveDashboard(savedDashboard);
                })
                .then(function (response) {
                    var savedDashboard = response.data;
                    if (savedDashboard.dashboardId === dashboard.dashboardId) {
                        angular.copy(savedDashboard, dashboard);
                    } else {
                        vm.allDashboards.push(savedDashboard);
                    }
                    notifications.success('Dashboard saved');
                })
                .catch(function (error) {
                    if (error) {
                        notifications.error( 'Could not save dashboard.',error);
                    }
                });
        }

        function addDashboard() {
            var newDash = {
                totalSecondsPerCycle: 60,
                pages: [{
                    percentageOfCycle: 100,
                    widgets: []
                }],
                setPageSeconds: function (index, value) {
                    pages[index].percentageOfCycle = value;
                }
            };
            editDashboard(newDash);
        }

        function deleteDashboard(dashboard) {
            var modalInstance = $modal.open({
                animation: true,
                size: 'sm',
                templateUrl: 'dashboard/views/modals/delete-dashboard-modal.html',
                controller: 'DeleteDashboardModalController as modal',
                resolve: {
                    dashboard: function () {
                        return dashboard;
                    }
                }
            });

            modalInstance.result
                .then(function () {
                    return dashboardAdminService.deleteDashboard(dashboard);
                })
                .then(function (response) {
                    notifications.success('Dashboard deleted');
                    activate();
                })
                .catch(function (error) {
                    if (error) {
                        notifications.error('Could not delete dashboard.',error);
                    }
                });
        }


        function secondsPerPage(page, dashboard) {
            if (!dashboard.totalSecondsPerCycle) {
                return 'No rotation set';
            }

            if (dashboard.totalSecondsPerCycle === 0 || dashboard.pages.length === 1) {
                return dashboard.totalSecondsPerCycle + 's';
            }
            return Math.round(page.percentageOfCycle / 100 * dashboard.totalSecondsPerCycle) + 's';
        }


    }
}());
