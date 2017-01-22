'use strict';
var BBPromise = require('bluebird');

var mongoose = BBPromise.promisifyAll(require('mongoose')),
    Schema = mongoose.Schema;

var DashboardClientSchema = new Schema({
    lastConnected: {type: Date, default: Date.now},
    ip: {type: String},
    name: {type: String},
    lastConnectedDashboard : {type:String},
    defaultDashboard : {type : String}
});

DashboardClientSchema.statics.loadByIp = function (ip) {
    return this.findOneAsync(
        {ip: ip}
    );
};

DashboardClientSchema.statics.searchByName = function (name) {
    return this.findAsync(
        {name: new RegExp(name,'i')}
    );
};

DashboardClientSchema.statics.all = function () {
    return this.findAsync();
};

mongoose.model('DashboardClient', DashboardClientSchema);

