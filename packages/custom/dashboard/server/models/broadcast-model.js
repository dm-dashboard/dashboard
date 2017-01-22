'use strict';
var BBPromise = require('bluebird');

var mongoose = BBPromise.promisifyAll(require('mongoose')),
    Schema = mongoose.Schema;

var BroadcastSchema = new Schema({
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    dashboard: { type: String },
    allClients : {type : Boolean},
    clients: [{
        ip: { type: String }
    }],
    cancelled: { type: Boolean, default: false }
});

BroadcastSchema.statics.loadById = function (id) {
    return this.findOneAsync(
        {
            "_id" : id
        });
};

BroadcastSchema.statics.loadAllCurrentAndFuture = function () {
    return this.findAsync(
        {
            $and: [
                { cancelled: false },
                { endTime: { $gt: new Date() }}
            ]
        },
        {},
        { sort: { 'startTime': 1 } }
        );
};

mongoose.model('Broadcast', BroadcastSchema);
