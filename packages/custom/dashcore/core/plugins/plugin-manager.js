'use strict';
//var plugins = require('./plugins.json');

var loadedPlugins = {};
var settingsCallbacks = {};
var availableWidgets = {};
var plugins = [];
var schedulers = {};
var path = require('path');

var loggerFactory = require('../logging/logger');

var logger = loggerFactory.logger('Plugin Manager');
var socketManager = require('../sockets/sockets-manager');
var mean = require('meanio');
var config = mean.loadConfig();
var BBPromise = require('bluebird');
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

var _ = require('lodash'),
    moment = require('moment');

var agendaInstance;
var _core;

var watchdogChecker;

function getPackageRoot(source, name){
    return config.root + '/' + source + '/' + name + '/';
}

function getSocketModule(pluginName, pluginSource, moduleName){
    logger.info('Loading socket module for \'' + pluginName + '\' from [' + moduleName + ']');
    return require(getPackageRoot(pluginSource,pluginName) + moduleName);
}

function makeSettingsGetter(plugin, pluginName) {
    return function(){
        return new BBPromise(function(resolve, reject){
            var module = mean.resolved[pluginName].result;
            var settingsAsync = BBPromise.promisify(module.settings, module);

            settingsAsync().then(function(settings) {
                if (settings === null){
                    logger.debug('Using default settings for [' + pluginName + ']');
                    var packageDetails = require(getPackageRoot(plugin.source, pluginName) + 'package.json');
                    var pluginConfig = packageDetails.dashboard || null;
                    var defaults = pluginConfig  ? pluginConfig.defaultSettings || {} : {};
                    module.settings(defaults);
                    resolve(defaults);
                }else {
                    resolve(settings.settings);
                }
            }).error(function(err){
                reject(err);
            });
        });
    };
}

//5 minutes
var watchdogTimeout = 10 * 60;

var loggedWatchdogPlugins = false;

var fixedWidthString = function(moduleName, submoduleName, width){
    var str = moduleName + '.' + submoduleName;
    width = width || 50;
    while (str.length < width){
        str += ' ';
    }
    return str;
};

var checkForDeadPlugins = function() {
    var allOK = true;
    var now = moment();
    logger.debug('Watchdog is keeping an eye on:');

    _.each(watchdogModules, function(subModules, mainModuleName){
        _.each(subModules, function(submoduleLastKick, subModuleName){
            var secondsSinceLastKick = now.diff(submoduleLastKick, 'seconds');
            logger.debug('\t' + fixedWidthString(mainModuleName,subModuleName) + '\t\t(last kick was ' + secondsSinceLastKick + ' seconds ago)');
            if (secondsSinceLastKick >= watchdogTimeout){
                logger.error(fixedWidthString(mainModuleName,subModuleName) + '\t has not kicked the watchdog in ' + secondsSinceLastKick + ' seconds. Restarting ' + mainModuleName + ' module');
                startModule(mainModuleName);
                allOK = false;
            }
        });
    });

    if (allOK){
        logger.debug('All plugins appear to be running OK (i.e. i\'ve heard from them in the last ' + (watchdogTimeout) + ' seconds)');
    }
    logger.debug('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
};

var watchdogModules = {};

function registerSubmodule(pluginName, submoduleName){
    logger.info('Plugin [' + pluginName + '.' + submoduleName + '] registered with watchdog');
    if (!watchdogModules[pluginName]){
        watchdogModules[pluginName] = {};
    }
    kickWatchdog(pluginName,submoduleName);
    loggedWatchdogPlugins = false;
}

function kickWatchdog(pluginName, submoduleName){
    logger.debug('Plugin [' + pluginName + '.' + submoduleName + '] kicking watchdog');
    watchdogModules[pluginName][submoduleName] = moment();
}

function makeAgendaScheduler(pluginName, agenda){
    var define = function(jobName, jobImpl){
        return agenda.define(jobName, function(job,done){
            jobImpl(done);
        });
    };

    var namespace = function(jobName){
        return pluginName + '@@' + jobName;
    };

    return {
        schedule : function(jobname, interval, job){
            define(namespace(jobname),job);
            return agenda.every(interval, namespace(jobname));
        },
        runAt : function(jobname, when, job){
            define(namespace(jobname),job);
            return agenda.schedule(when, namespace(jobname));
        },
        runNow : function(jobname, job){
            define(namespace(jobname),job);
            return agenda.now(namespace(jobname));
        },cancel : function(jobname){
            agenda.cancel({name : namespace(jobname)});
        }
    };
}

var startModule = function(name){
    var watchdog = {
        register : registerSubmodule,
        kick : kickWatchdog
    };
    logger.info('Calling .init on [' + name + ']');
    loadedPlugins[name].init(_core,socketManager, settingsCallbacks[name], loggerFactory.logger('plugin.' + name), schedulers[name], watchdog);
};

var startUp = function(core, app){
    _core = core;
    return loggerFactory.init()
        .then(function () {
            agendaInstance = new Agenda({
                db: {
                    address: config.db,
                    collection: 'scheduledJobs'
                },
                processEvery: '1 second',
                maxConcurrency: 3
            });
            //app.use('/agenda-ui', agendaUI(agendaInstance, {poll: 1000}));

            agendaInstance.on('fail', function(err,job) {
                logger.error('Job ' + job.attrs.name + ' failed with error [' + err + ']');
                logger.error(err.stack);
            });

            function gracefulShutdownOfScheduler() {
                logger.info('Dashboard shut down');
                logger.info('Stopping watchdog');
                clearInterval(watchdogChecker);
                logger.info('Stopping scheduler');
                agendaInstance.stop(function() {
                    logger.info('Scheduler shut down, Dashboard can now stop');
                    process.exit(0);
                });
            }

            process.on('SIGTERM', gracefulShutdownOfScheduler);
            process.on('SIGINT' , gracefulShutdownOfScheduler);

            logger.info('Clearing exisiting jobs from DB');
            agendaInstance.cancel(function (err, numRemoved) {
                if (err) {
                    logger.error('Could not clear scheduled jobs [' + err + ']');
                    return;
                }
                logger.debug('Cleared ' + numRemoved + ' jobs from DB');
            });

            var module = mean.modules.head;
            logger.info('Loading plugins...');
            while (module) {
                var plugin = module.content;
                var name = plugin.name;
                var packageDetails = require(getPackageRoot(plugin.source, name) + 'package.json');
                var pluginconfig = packageDetails.dashboard || null;
                if (pluginconfig) {
                    if (!pluginconfig.enabled) {
                        logger.warn(name + ' is disabled, not loading');
                        module = module.link;
                        continue;
                    }
                    if (!loadedPlugins[name]) {
                        schedulers[name] = makeAgendaScheduler(name, agendaInstance);
                        settingsCallbacks[name] = makeSettingsGetter(plugin, name);
                        loadedPlugins[name] = getSocketModule(name, plugin.source, pluginconfig.module);
                        startModule(name);
                        availableWidgets[name] = pluginconfig.widgets;
                        plugins.push({
                            name:name,
                            display:pluginconfig.displayName
                        });
                    }
                }
                module = module.link;
            }

            logger.info('Loading plugins...Done');
            logger.info('Don\'t expect too much on this log except for the watchdog. See the file logs for more details');
            _.each(loggerFactory.logPaths(), function(logPath){
                logger.info('\t\t' + path.resolve(logPath));
            });
            logger.info('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-')
            setTimeout(function(){
                logger.info('Starting scheduler');
                agendaInstance.start();
            },10000);

            checkForDeadPlugins();
            watchdogChecker = setInterval(function(){
                checkForDeadPlugins();
            },10 * 1000);
            return agendaInstance;
        });
};

var refreshAll = function(done){
    for (var pluginName in loadedPlugins){
        loadedPlugins[pluginName].refresh();
    }
    done();
};

module.exports = {
    startUp : startUp,
    widgets : availableWidgets,
    plugins : plugins,
    refreshAll : refreshAll
};
