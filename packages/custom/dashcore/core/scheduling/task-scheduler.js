'use strict';

var queue = [];
var logger = require('../logging/logger').logger('task-scheduler');
var BBPromise = require('bluebird');

var process = function(){
    logger.debug('Checking if items in queue');
    if (queue.length > 0){
        logger.debug('Job found executing');
        var job = queue.shift();
        job()
            .then(function(result){
                return result;
            })
            .finally(process);
    }else{
        logger.debug('Queue empty, sleeping until next push');
    }
};

var push = function(job){
    if (job instanceof BBPromise) {
        queue.push(job);
        logger.debug('New job pushed to queue');
        process();
    }else{
        logger.warn('Could not push job onto queue, its not a promise');
    }
};

module.exports = {
  push : push
};