'use strict';
//http://johnkalberer.com/2011/08/24/automapper-in-javascript/

var _ = require('lodash');

var mappings = {};

var map = function(sourceKey, destinationKey, sourceObject, destinationObject, oneTimeOptions){
    var customMapping = mappings[sourceKey+destinationKey];
    oneTimeOptions = oneTimeOptions || {};
    var options = customMapping ? customMapping.options : {};
    options = _.extend(_.extend({},options),oneTimeOptions);
    for (var key in sourceObject){
        if (sourceObject.hasOwnProperty(key)){
            var keyMappingFunction = null;
            if (customMapping && customMapping.hasOwnProperty(key)){
                keyMappingFunction = customMapping[key];
            }
            if (keyMappingFunction){
                keyMappingFunction(sourceObject, destinationObject, key);
                continue;
            }

            if (options.createInDestination){
                destinationObject[key] =  sourceObject[key];
                continue;
            }
            if (destinationObject.hasOwnProperty(key)){
                destinationObject[key] = sourceObject[key];
            }
        }
    }
};

var mapToNew = function(sourceKey, destinationKey, sourceObject) {
    var newObject = {};
    map(sourceKey,destinationKey,sourceObject,newObject, {createInDestination : true});
    return newObject;
};

var createCustomMapping = function(sourceKey, destinationKey, options){
    options = _.extend({},options);
    var combinedKey = sourceKey + destinationKey;
    mappings[combinedKey] = {};
    mappings[combinedKey].options = options;
    var functions = {
        forMember: function (key, func) {
            mappings[combinedKey][key] = func;
            return functions;
        }
    };
    return functions;
};

module.exports = {
    map : map,
    mapToNew : mapToNew,
    createCustomMapping : createCustomMapping
};


//
//var automapper = {
//
//    createMap: function (sourceKey, destinationKey) {
//        var combinedKey = sourceKey + destinationKey;
//        var functions;
//        mappings[combinedKey] = {};
//
//        functions = {
//            forMember: function (key, e) {
//                mappings[combinedKey][key] = e;
//                return functions;
//            },
//            forAllMembers: function (func) {
//                mappings[combinedKey].__forAllMembers = func;
//                return functions;
//            }
//        };
//        return functions;
//    },
//
//    map: function (sourceKey, destinationKey, sourceValue, destinationValue, strict) {
//        if (!sourceValue && sourceValue !== false) {
//            return;
//        }
//
//        function getValue(item) {
//            if (typeof item === 'function') {
//                return item();
//            }
//            return item;
//        }
//
//        var combinedKey = sourceKey + destinationKey;
//        var mappings = mappings[combinedKey], output,
//            extensions = {
//                ignore: function () {
//                    // don't do anything
//                },
//                mapTo: function (destinationMemberKey) {
//                    if (!this.__destinationValue.hasOwnProperty(destinationMemberKey)) {
//                        throw destinationKey + '.' + destinationMemberKey + ' has not been defined.';
//                    }
//                    var value = getValue(this.__destinationValue[destinationMemberKey]);
//                    if (mappings.__forAllMembers) {
//                        mappings.__forAllMembers(this.__destinationValue, this.__key, value);
//                    } else {
//                        this.__destinationValue[this.__key] = value;
//                    }
//                }
//            };
//
//        if (!mappings) {
//            throw 'Could not find mapping with a source of ' + sourceKey + ' and a destination of ' + destinationKey;
//        }
//
//        function mapItem(destinationValue, sourceValue) {
//            for (var key in sourceValue) {
//                if (!sourceValue.hasOwnProperty(key)) {
//                    continue;
//                }
//                console.log('map ' + key);
//                if (mappings.hasOwnProperty(key) && mappings[key]) {
//                    if (typeof mappings[key] === 'function') {
//                        extensions.__key = key;
//                        extensions.__sourceValue = sourceValue;
//                        extensions.__destinationValue = destinationValue;
//
//                        output = mappings[key].call(extensions);
//                    } else {  // forMember second parameter was not a function
//                        output = mappings[key];
//                    }
//                    // object was returned from the 'forMember' call
//                    if (output) {
//                        var value = getValue(output);
//                        if (mappings.__forAllMembers) {
//                            mappings.__forAllMembers(sourceValue, key, value);
//                        } else {
//                            sourceValue[key] = value;
//                        }
//                    }
//                }
//                else  {
//                    var propertyExists = destinationKey.hasOwnProperty(key);
//                    if (!propertyExists){
//                        if (strict) {
//                            throw sourceKey + '.' + key + ' has not been defined.';
//                        } else {
//                            continue;
//                        }
//                    }
//                    var val = getValue(sourceValue[key]);
//                    if (mappings.__forAllMembers) {
//                        mappings.__forAllMembers(sourceValue, key, val);
//                    } else {
//                        sourceValue[key] = val;
//                    }
//                }
//            }
//        }
//
//        // actually do the mapping here
//        if (sourceValue instanceof Array) {
//            if (destinationValue instanceof Array) {
//                // loop
//                for (var i = 0; i < sourceValue.length; i += 1) {
//                    if (!destinationValue[i]) {
//                        if (typeof destinationKey !== 'function') {
//                            throw 'destinationKey of mapping must be a function in order to initialize the array';
//                        }
//                        destinationValue[i] = destinationKey();
//                    }
//                    mapItem(destinationValue[i], sourceValue[i]);
//                }
//            } else {
//                throw 'Cannot map array to object';
//            }
//        }
//        else if (destinationValue instanceof Array) {
//            throw 'Cannot map object to array';
//        } else {
//            mapItem(destinationValue, sourceValue);
//        }
//    }
//};
//
//automapper.mapIgnoreUnmapped = function (sourceKey, destinationKey, sourceValue, destinationValue) {
//    automapper.map(sourceKey, destinationKey, sourceValue, destinationValue, false);
//};
//
//automapper.mapStrict = function (sourceKey, destinationKey, sourceValue, destinationValue) {
//    automapper.map(sourceKey, destinationKey, sourceValue, destinationValue, true);
//};


