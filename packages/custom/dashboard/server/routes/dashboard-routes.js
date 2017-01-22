'use strict';

var BBPromise = require('bluebird');
var mongoose = BBPromise.promisifyAll(require('mongoose'));

var DashboardModel = mongoose.model('Dashboard');

// The Package is past automatically as first parameter
module.exports = function (Dashboard, app, auth, database) {

    app.get('/dashboard/admin', auth.requiresAdmin, function (req, res, next) {
        Dashboard.render('admin', {
            package: 'dashboard'
        }, function (err, html) {
            res.send(html);
        });
    });


    app.route('/dashboard/template/:dashboardId')
        .get(function (req, res, next) {
            var dashboardId = req.params.dashboardId;

            DashboardModel.loadLatest(dashboardId)
                .then(function (dashboard) {

                    var timingConfig = [];
                    var totalSeconds = dashboard.totalSecondsPerCycle;
                    for (var i = 0; i < dashboard.pages.length; i++){
                        timingConfig.push(dashboard.pages[i].percentageOfCycle / 100 * totalSeconds);
                    }

                    Dashboard.render('dashboard', {
                        package: 'dashboard',
                        dashboard: dashboard,
                        showCandidates: req.query.showCandidates,
                        timingConfig : JSON.stringify(timingConfig)
                    }, function (err, html) {
                        res.send(html);
                    });
                }).catch(function (err) {
                    console.error(err);
                });

        });
};
