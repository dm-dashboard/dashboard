'use strict';
var BBPromise = require('bluebird');

var mongoose = BBPromise.promisifyAll(require('mongoose')),
    Schema = mongoose.Schema;
//mongoose.set('debug', true);

var DashboardSchema = new Schema({
    updated: {type: Date, default: Date.now},
    dashboardId: {type: String},
    name: {type: String},
    totalSecondsPerCycle: {type: Number},
    deleted : {type : Boolean},
    pages: [{
        percentageOfCycle: Number,
        order: Number,
        widgets: [
            {
                name: String,
                config: String,
                directive: String,
                sizeX: Number,
                sizeY: Number,
                row: Number,
                col: Number
            }
        ]
    }]
});

DashboardSchema.statics.loadLatest = function (id) {
    return this.findOneAsync(
        {
            $and: [
                {dashboardId: id || 'default'},
                {"deleted": {$exists: false}}
            ]
        }, {}, {sort: {'updated': -1}}
    ).then(function (dashboard) {
            return dashboard;
        });
};

DashboardSchema.statics.loadLatestForAll = function (id) {
    var self = this;
    return new BBPromise(function (resolve, reject) {
        var aggregation = self.aggregate([
            {
                $match: {
                    $and: [
                        {"dashboardId": {$exists: true}},
                        {"deleted": {$exists: false}}
                    ]
                }
            },
            {$sort: {"updated": -1}},
            {
                $group: {
                    _id: "$dashboardId",
                    latest: {"$first": "$$ROOT"}
                }
            }
        ]);

        aggregation.exec(function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
        .then(function (result) {
            return result.map(function (dashoard) {
                return dashoard.latest;
            }).sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        });
};


mongoose.model('Dashboard', DashboardSchema);
