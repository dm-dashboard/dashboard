'use strict';

var _socketIO;
var _listeners = {};
var _ = require('lodash');
var logger = require('../logging/logger').logger('socket-manager');
var pluginManager;
var BBPromise = require('bluebird');
require('../models/dashboard-client-model');
var mongoose = BBPromise.promisifyAll(require('mongoose'));
var DashboardClient = mongoose.model('DashboardClient');


var getSocketById = function (socketID) {
    return _socketIO.sockets.sockets.filter(function (socket) {
        return socket.id == socketID;
    })[0];
};

var sendMessageToSocket = function (socketID, message, messageTag) {
    messageTag = messageTag || 'message';
    getSocketById(socketID).emit(messageTag, message);
};

var sendMessageToAllSockets = function (message) {
    _socketIO.sockets.emit('message', message);
};

var sendMessageToPlugin = function (socketID, listener, message, source) {
    listener(message, function (reply) {
        logger.debug('Sending reply message to ' + socketID);
        sendMessageToSocket(socketID, {
            name: source,
            payload: reply
        });
    });
};

var sendInternalMessageToPlugin = function (pluginName, message, replyCallback) {
    if (_listeners[pluginName]) {
        _listeners[pluginName](message, function (reply) {
            if (replyCallback) {
                replyCallback(reply);
            }
        });
    }
};

var messageReceived = function (socketID, message) {
    if (!message.name) {
        logger.warn('Unknown message received [' + message + ']');
        return;
    }
    var addressedTo = message.name;
    if (addressedTo === '*') {
        logger.debug('Message received for all plugins');
        _.forEach(_listeners, function (listener, name) {
            logger.debug('Forwarding message <' + JSON.stringify(message.payload) + '> to [' + name + ']');
            sendMessageToPlugin(socketID, listener, message.payload, name);
        });
    } else if (_listeners[addressedTo]) {
        logger.debug('Forwarding message <' + JSON.stringify(message.payload) + '> to [' + addressedTo + ']');
        sendMessageToPlugin(socketID, _listeners[addressedTo], message.payload, addressedTo);
    }
    else {
        logger.warn('Message received for unknown plugin [' + addressedTo + ']');
    }
};

var registerListener = function (name, callback) {
    _listeners[name] = callback;
};

var timerRefresh = function (done) {
    pluginManager.refreshAll(done);
};

var getSocketIp = function (socket) {
    var ip = socket.conn.remoteAddress.replace('::', '');
    ip = ip.indexOf(':') >= 0 ? ip.substr(ip.indexOf(':') + 1) : ip;
    if (ip === '1' || ip === '127.0.0.1') {
        ip = 'localhost';
    }
    return ip;
};

var changeDashboardMessage = {
        name: '_SYSTEM_',
        payload: {command : 'changeDashboard'}
    };

var _init = function (socketIO, core, app) {
    return new BBPromise(function (resolve, reject) {
        pluginManager = require('../plugins/plugin-manager');
        _socketIO = socketIO;
        pluginManager.startUp(core, app)
            .then(function (scheduler) {
                scheduler.schedule('forced-refresh', '1 minute', timerRefresh);
                _socketIO.sockets.on('connection', function (socket) {
                    sendMessageToSocket(socket.id, { info: 'Connection Registered' }, 'init');
                    var ip = getSocketIp(socket);
                    DashboardClient.loadByIp(ip)
                        .then(function (client) {
                            if (!client) {
                                client = new DashboardClient();
                                client.ip = ip;
                                client.name = ip;
                                client.defaultDashboard = 'default';
                            }
                            client.lastConnected = new Date();
                            client.save();

                            socket.on('boot', function (message) {
                                if (message.dashboard) {
                                    client.lastConnectedDashboard = message.dashboard;
                                    client.save();
                                } else {
                                    changeDashboardMessage.payload.dashboardId = client.defaultDashboard;
                                    sendMessageToSocket(socket.id, changeDashboardMessage);
                                }

                            });
                        });
                    socket.on('message', function (message) {
                        messageReceived(socket.id, message);
                    });

                });
                resolve(scheduler);
            })
            .catch(reject);
    });
};

var connectedClients = function () {
    return DashboardClient.all()
        .then(function (knownClients) {
            var connectedClients = _socketIO.sockets.sockets.map(function (socket) {
                return {
                    id: socket.id,
                    ip: getSocketIp(socket)
                };
            });
            return knownClients.map(function (client) {
                var unMongoosed = JSON.parse(JSON.stringify(client));
                var connected = connectedClients.filter(function (connectedClient) {
                    return connectedClient.ip === unMongoosed.ip;
                })[0];
                unMongoosed.connected = !!connected;
                if (connected) {
                    unMongoosed.uniqueId = connected.id;
                }
                return unMongoosed;
            });
        });
};

module.exports = {
    _init: _init,
    sendMessageToAllSockets: sendMessageToAllSockets,
    sendMessageToSocket: sendMessageToSocket,
    sendInternalMessageToPlugin: sendInternalMessageToPlugin,
    registerListener: registerListener,
    connectedClients: connectedClients
};