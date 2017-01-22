(function () {
    'use strict';

    angular.module('mean.dashboard')
        .factory('dashboardAdminService', DashboardAdminService);

    DashboardAdminService.$inject = ['$http', '$q'];

    function DashboardAdminService($http, $q) {
        var service = {};

        service.getPlugins = getPlugins;
        service.getDashboards = getDashboards;
        service.saveDashboard = saveDashboard;
        service.getWidgets = getWidgets;
        service.deleteDashboard = deleteDashboard;


        function getPlugins() {
            return $http.get('/dashboard/admin/plugins')
                .then(function (response) {
                    return response.data;
                });
        }

        function getDashboards() {
            return $http.get('/dashboard/admin/list')
                .then(function (response) {
                    return response.data;
                });
        }

        function saveDashboard(dashboard) {
            var promise;
            if (dashboard.dashboardId) {
                promise = $http.put('/dashboard/' + dashboard.dashboardId + '/admin', dashboard);
            } else {
                promise = $http.put('/dashboard/new/admin', dashboard);
            }
            return promise;
        }

        function deleteDashboard(dashboard){
            return $http.delete('/dashboard/' + dashboard.dashboardId);
        }

        var widgetListCache = {};

        function getWidgets(plugin) {
            var deferred = $q.defer();
            if (widgetListCache[plugin]) {
                deferred.resolve(widgetListCache[plugin]);
            } else {
                $http.get('/dashboard/admin/plugins/' + plugin + '/widgets')
                    .then(function (response) {
                        return response.data;
                    })
                    .then(function (widgets) {
                        widgetListCache[plugin] = widgets;
                        deferred.resolve(widgets);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });
            }
            return deferred.promise;
        }

        return service;
    }

})();
