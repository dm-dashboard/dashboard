'use strict';

var grunt = require('grunt'),
    path = require('path');


var createWatchdogKicker = function(watchdog,pluginName, moduleName){
    var watchdogKicker = function(){
        watchdog.kick(pluginName, moduleName);
    };
    watchdog.register(pluginName, moduleName);
    return watchdogKicker;
};

module.exports = function(localPath, pattern, initFunction, logger, blacklist, watchdog, pluginName){
    var components = [];
    var assets = grunt.file.expand({filter: 'isFile'}, path.join(localPath,pattern));
    for (var index in assets){
        var moduleName = path.basename(assets[index],'.js');
        if (blacklist && blacklist.indexOf(moduleName) >= 0){
            logger.warn('Ignoring ' + moduleName + ' as its blacklisted');
            continue;
        }
        logger.info('Loading ' + moduleName);
        var module = require(path.join(localPath,moduleName));

        initFunction(moduleName, module, createWatchdogKicker(watchdog,pluginName,moduleName));
        components.push(module);
    }
    return components;
};
