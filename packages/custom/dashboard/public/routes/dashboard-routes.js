/* global angular */
'use strict';

angular.module('mean.dashboard').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.state('dashboard admin', {
            url: '/dashboardadmin',
            templateUrl: 'dashboard/views/dashboard-admin.html'
        });

        $stateProvider.state('dashboard specific', {
            url: '/dashboard/:dashboardId',
            templateUrl: function (stateParams) {
                return '/dashboard/template/' + stateParams.dashboardId;
            }
        });

        $stateProvider.state('dashboard home', {
            url: '/dashboard',
            templateUrl: '/dashboard/template/default'
        });

        $stateProvider.state('dashboard control', {
            url: '/dashboard_control',
            templateUrl: 'dashboard/views/client-control.html'
        });


    }
]);
