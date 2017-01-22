'use strict';

var BBPromise = require('bluebird');

module.exports = function (clientOrFunction, name,url, method) {
    var restFunction = clientOrFunction;

    if (name && url && method){
        clientOrFunction.registerMethod(name, url, method);
        restFunction = clientOrFunction.methods[name];
    }

    return function () {
        var args = Array.prototype.slice.call(arguments);
        return new BBPromise(function(resolve,reject){
            args.push(function (data, response) {
                resolve(data);
            });
            restFunction.apply(this, args).on('error', function (err) {
                reject(err);
            });
        });
    };
};
