"use strict";
var Route;
(function (Route) {
    class Home {
        index(req, res, next) {
            res.send('Hello World');
        }
    }
    Route.Home = Home;
})(Route || (Route = {}));
module.exports = Route;
//# sourceMappingURL=HomeRoute.js.map