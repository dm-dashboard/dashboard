'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Dashcore, app, auth, database) {

  app.get('/dashcore/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/dashcore/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/dashcore/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/dashcore/example/render', function(req, res, next) {
    Dashcore.render('index', {
      package: 'dashcore'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
