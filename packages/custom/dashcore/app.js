'use strict';

var Module = require('meanio').Module;
//noinspection SpellCheckingInspection
var Dashcore = new Module('dashcore');

Dashcore.register(function(app, auth, database) {
  Dashcore.logging = {
    logger : require('./core/logging/logger')
  };
  Dashcore.plugins = {
    pluginManager :  require('./core/plugins/plugin-manager')
  };
  Dashcore.scheduling= {
    taskScheduler :  require('./core/scheduling/task-scheduler')
  };
  Dashcore.sockets = {
    socketManager :  require('./core/sockets/sockets-manager')
  };
  Dashcore.util = {
    autoMapper :  require('./core/util/automapper'),
    promiseRestWrapper :  require('./core/util/rest-promise-wrapper'),
    submoduleLoader:  require('./core/util/submodule-loader')
  };

  return Dashcore;
});
