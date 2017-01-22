'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Dashboard = new Module('dashboard');

//require('long-stack-traces');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Dashboard.register(function (app, auth, database, dashcore, http) {

    process.on('uncaughtException', function(error){
        console.error(error);
        console.error(error.stack);
    });

    var io = require('socket.io').listen(http);
    dashcore.sockets.socketManager._init(io, dashcore, app)
        .catch(function(error){
            console.error(error);
        });

    Dashboard.routes(app, auth, database);
    Dashboard.core = dashcore;

    //We are adding a link to the main menu for all authenticated users
    Dashboard.menus.add({
        title: 'Default Dashboard',
        link: 'dashboard home',
        roles: ['anonymous'],
        menu: 'main'
    });

    Dashboard.menus.add({
        title: 'Dashboard Admin',
        link: 'dashboard admin',
        roles: ['admin'],
        menu: 'main'
    });

    Dashboard.menus.add({
        title: 'Client Status & Control',
        link: 'dashboard control',
        roles: ['admin'],
        menu: 'main'
    });

    Dashboard.aggregateAsset('css', 'dashboard.css');
    Dashboard.aggregateAsset('css', '../lib/jquery-ui/themes/black-tie/jquery-ui.min.css');
    Dashboard.aggregateAsset('css', '../lib/jquery-ui/themes/black-tie/theme.css');
    Dashboard.aggregateAsset('css', '../lib/jqPlot/jquery.jqplot.min.css');
    Dashboard.aggregateAsset('css', '../lib/angular-gridster/dist/angular-gridster.min.css');
    Dashboard.aggregateAsset('css', '../lib/angular-carousel/dist/angular-carousel.min.css');
    Dashboard.aggregateAsset('css', '../lib/slider/slider.css');
    Dashboard.aggregateAsset('css', '../lib/ngtoast/dist/ngToast.min.css');
    Dashboard.aggregateAsset('css', '../lib/ngtoast/dist/ngToast-animations.min.css');
    
    Dashboard.aggregateAsset('css', '../lib/ng-tags-input/ng-tags-input.css');

    Dashboard.aggregateAsset('js', '../lib/angular-touch/angular-touch.min.js');
    Dashboard.aggregateAsset('js', '../lib/angular-carousel/dist/angular-carousel.min.js');
    Dashboard.aggregateAsset('js', '../lib/angular-charts/dist/angular-charts.min.js');

    Dashboard.aggregateAsset('js', '../lib/angular-ui-chart/src/chart.js');
     Dashboard.aggregateAsset('js', '../lib/ng-tags-input/ng-tags-input.js');

    Dashboard.aggregateAsset('js', '../lib/momentjs/min/moment.min.js');
    Dashboard.aggregateAsset('js', '../lib/d3/d3.min.js');
    Dashboard.aggregateAsset('js', '../lib/jquery-ui/jquery-ui.min.js', {weight : -10});
    Dashboard.aggregateAsset('js', '../lib/javascript-detect-element-resize/detect-element-resize.js', {weight : -9});
    Dashboard.aggregateAsset('js', '../lib/jqplot/jquery.jqplot.min.js', {weight : -1});
    Dashboard.aggregateAsset('js', '../lib/jqplot/plugins/jqplot.pieRenderer.min.js', {weight : 0});
    Dashboard.aggregateAsset('js', '../lib/jquery-ui/ui/resizable.js', {weight : 1});
    Dashboard.aggregateAsset('js', '../lib/angular-gridster/src/angular-gridster.js', {weight : 2});

    Dashboard.aggregateAsset('js', '../lib/slider/slider.js');
    Dashboard.aggregateAsset('js', '../lib/ngToast/dist/ngToast.min.js');    

    Dashboard.angularDependencies(['gridster', 'angular-carousel', 'angularCharts', 'ui.chart', 'ngTouch', 'ngAnimate','ngSanitize', 'ngToast', 'ngTagsInput']);
    return Dashboard;
});
