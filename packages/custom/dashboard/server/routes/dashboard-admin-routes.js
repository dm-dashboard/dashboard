'use strict';

var BBPromise = require('bluebird');
var mongoose = BBPromise.promisifyAll(require('mongoose'));
var _ = require('lodash');

var BroadcastModel = mongoose.model('Broadcast');
var DashboardModel = mongoose.model('Dashboard');
var DashboardClientModel = mongoose.model('DashboardClient');


function generateId(name) {
    return name.replace(/ /g, '').toLowerCase();
}

module.exports = function (Dashboard, app) {
    app.route('/dashboard/admin/plugins')
        .get(function (req, res) {
            res.json(Dashboard.core.plugins.pluginManager.plugins);
        });

    app.route('/dashboard/admin/clients')
        .get(function (req, res) {
            Dashboard.core.sockets.socketManager.connectedClients()
                .then(function (result) {
                    res.json(result);
                });
        });

    var refreshMessage = {
        name: '_SYSTEM_',
        payload: { command: 'refresh' }
    };

    app.route('/dashboard/admin/forceRefresh')
        .post(function (req, res) {
            var target = req.body.socketId;
            if (target) {
                Dashboard.core.sockets.socketManager.sendMessageToSocket(target, refreshMessage);
            } else {
                Dashboard.core.sockets.socketManager.sendMessageToAllSockets(refreshMessage);
            }
            res.json(true);
        });

    app.route('/dashboard/admin/rename')
        .post(function (req, res) {
            var target = req.body.client;
            var newName = req.body.newName;
            DashboardClientModel.loadByIp(target)
                .then(function (client) {
                    if (client) {
                        client.name = newName;
                        client.saveAsync()
                            .then(function () {
                                res.json(true);
                            })
                    } else {
                        res.error('No client found with that ip');
                    }
                });

        });

    app.route('/dashboard/admin/default')
        .post(function (req, res) {
            var target = req.body.client;
            var newDefault = req.body.newDefault;
            DashboardClientModel.loadByIp(target)
                .then(function (client) {
                    if (client) {
                        client.defaultDashboard = newDefault;
                        client.saveAsync()
                            .then(function () {
                                res.json(true);
                            })
                    } else {
                        res.error('No client found with that ip');
                    }
                });

        });

    var identifyMessage = {
        name: '_SYSTEM_',
        payload: { command: 'identify' }
    };

    app.route('/dashboard/admin/identify')
        .post(function (req, res) {
            identifyMessage.payload.text = req.body.text;
            var target = req.body.socketId;
            Dashboard.core.sockets.socketManager.sendMessageToSocket(target, identifyMessage);
            res.json(true);
        });

    app.route('/dashboard/admin/list')
        .get(function (req, res) {
            DashboardModel.loadLatestForAll()
                .then(function (dashboards) {
                    res.json(dashboards);
                });
        });

    app.route('/dashboard/admin/plugins/:plugin/widgets')
        .get(function (req, res) {
            res.json(Dashboard.core.plugins.pluginManager.widgets[req.params.plugin]);
        });

    app.route('/dashboard/:dashboardId/admin')
        .put(function (req, res) {
            var newDashboard = new DashboardModel();
            newDashboard.name = req.body.name;
            newDashboard.dashboardId = req.body.dashboardId || generateId(req.body.name);
            newDashboard.totalSecondsPerCycle = req.body.totalSecondsPerCycle;
            newDashboard.pages = req.body.pages;
            newDashboard.updated = new Date();

            newDashboard.save(function (err, result) {
                res.json(newDashboard);
                Dashboard.core.sockets.socketManager.sendMessageToAllSockets({
                    name: '_SYSTEM_',
                    payload: 'refresh'
                });
            });
        });

    app.route('/dashboard/:dashboardId')
        .delete(function (req, res) {
            DashboardModel.loadLatest(req.params.dashboardId)
                .then(function (dashboard) {
                    dashboard.deleted = true;
                    dashboard.save();
                    res.json();
                });
        });

    app.route('/dashboard/:dashboardId/admin')
        .get(function (req, res) {
            DashboardModel.loadLatest(req.params.dashboardId)
                .then(function (dashboard) {
                    res.json(dashboard);
                });
        });

    function updateBroadcast(existing, newBroadcast) {
        existing.startTime = newBroadcast.startTime;
        existing.endTime = newBroadcast.endTime;
        existing.dashboard = newBroadcast.dashboard;

        return DashboardClientModel.all()
            .then(function (clients) {
                if (newBroadcast.clients[0]._id === '__all__') {
                    existing.allClients = true;
                    existing.clients = [];
                } else {
                    existing.allClients = false;
                    existing.clients = newBroadcast.clients.map(function (clientId) {
                        var ip = clients.filter(function (dbClient) {
                            return JSON.parse(JSON.stringify(dbClient))._id === clientId._id;
                        })[0].ip;
                        return {
                            ip: ip
                        }
                    });
                }
                return existing;
            });
    }

    function saveBroadcast(broadcast) {
        return newBroadcast.saveAsync()
            .then(function (savedBroadcast) {
                res.json(savedBroadcast)
            })
            .catch(function (error) {
                res.error(error);
            });
    }

    app.route('/dashboard/admin/broadcast')
        .post(function (req, res) {
            if (req.body._id) {
                BroadcastModel.loadById(req.body._id)
                    .then(function (existingBroadcast) {
                        return updateBroadcast(existingBroadcast, req.body);
                    })
                    .then(saveBroadcast);
            } else {
                updateBroadcast(new BroadcastModel(), req.body)
                    .then(saveBroadcast);
            }
        });

    app.route('/dashboard/admin/broadcast/:id')
        .delete(function (req, res) {
            BroadcastModel.loadById(req.params.id)
                .then(function (broadcast) {
                    broadcast.cancelled = true;
                    broadcast.saveAsync()
                        .then(function () { res.json(true) });
                })
        });

    app.route('/dashboard/admin/broadcasts')
        .get(function (req, res) {
            BroadcastModel.loadAllCurrentAndFuture()
                .then(function (broadcasts) {
                    res.json(broadcasts);
                })
        });
};
