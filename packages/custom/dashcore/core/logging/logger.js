'use strict';

var moment = require('moment');
var winston = require('winston');
var mkdir = require('mkdirp');
var BBPromise = require('bluebird');
var currentLogFilePaths = [];

var init = function(logFolder){
    var date = moment().format('YYYYMMDD');
    logFolder = logFolder || "./logs";
    logFolder = logFolder + '/' + date;

    return new BBPromise(function(resolve, reject){
        mkdir(logFolder, function(err){
            if (err) {
                console.error('Could not create log directory [' + logFolder + ']: ' + err);
                reject();
                return;
            }

            var baseName = logFolder + '/dashboard_' + date;
            currentLogFilePaths.push(baseName + '.log');
            currentLogFilePaths.push(baseName + '.json');
            winston.loggers.add('default', {
                console : {
                    level : 'info',
                    colorize : true,
                    timestamp : true
                },
                file : {
                    level : 'debug',
                    filename : baseName + '.log',
                    maxSize : 10485760, //10 MB
                    json : false
                }
            });

            winston.loggers.add('json', {
                file : {
                    level : 'debug',
                    filename : baseName + '.json',
                    maxSize : 10485760 //10 MB
                }
            });
            winston.loggers.get('json').remove(winston.transports.Console);

            winston.info('[Winston] Booted up');
            resolve({folder:logFolder, timestamp:date});
        });
    });
};

var taggedLogger = function(tag){
    var formatTag = function(){
        var formatted = '[';
        if (tag instanceof Array){
            for (var index in tag){
                formatted += tag[index] + '][';
            }
            if (formatted.length >= 1){
                formatted = formatted.substring(0,formatted.length-1);
            }
            return formatted;
        }
        return '[' + tag + ']';
    };

    var formattedTag = formatTag();

    var log = function(level, message, error){
        level = level || 'debug';
        message = message + (error ? ('\n' + error) : '');
        message = message + (error && error.stack ? ('\n' + error.stack) : '');
        winston.loggers.get('default').log(level, formattedTag + ' ' + message);
        winston.loggers.get('json').log(level, formattedTag + ' ' + message);
    };

    return {
        log : function(message){
            log(null,message);
        },
        debug : function(message){
            log('debug',message);
        },
        verbose : function(message){
            log('verbose',message);
        },
        info : function(message){
            log('info',message);
        },
        warn : function(message){
            log('warn',message);
        },
        error: function(message, error){
            if (!error && (message.stack)){
                error = message;
                message = '';
            }
            log('error',message, error);
        },
        fork : function(subtag){
            return new taggedLogger([tag,subtag]);
        }
    };
};


module.exports = {
    init : init,
    logger : taggedLogger,
    logPaths : function(){
        return currentLogFilePaths;
    }
};