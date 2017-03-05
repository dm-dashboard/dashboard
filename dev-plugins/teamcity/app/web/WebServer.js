"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const Symbols_1 = require("../Symbols");
const Configuration_1 = require("../config/Configuration");
const express = require("express");
const path = require("path");
const http = require("http");
const serveStatic = require("serve-static");
const cors = require("cors");
const HomeRoute_1 = require("./routes/HomeRoute");
const inversify_1 = require("inversify");
const NG_APP_ROUTE = '/app';
let WebServer = class WebServer {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.server = http.createServer(this.app);
    }
    start(logger) {
        this.logger = logger;
        this.logger.info('Starting web server');
        this.server.listen(this.config.server.port);
        this.server.on('error', (error) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        this.enableDebugCors();
        this.setupRewrite();
        this.setupPipeline();
        return this.server;
    }
    shutdown() {
        this.logger.info('Shutting down');
        this.server.close();
    }
    enableDebugCors() {
        let corsOptions = {
            origin: 'http://localhost:4200'
        };
        this.app.use(cors(corsOptions));
    }
    setupRewrite() {
        let filesRegex = /^\/(.*\..*$)/;
        let apiRegex = /^\/api\/(.*$)/;
        let socketRegex = /^\/socket.io/;
        this.app.use((req, res, next) => {
            let fileMatch = filesRegex.exec(req.url);
            if (fileMatch) {
                req.url = `${NG_APP_ROUTE}/${fileMatch[1]}`;
            }
            else if (!apiRegex.test(req.url) && !socketRegex.test(req.url)) {
                req.url = `${NG_APP_ROUTE}/index.html`;
            }
            next();
        });
    }
    setupPipeline() {
        this.routeToFrontend();
        this.routeToApi();
    }
    routeToFrontend() {
        let ngApp = this.config.server.frontendLocation
            ? this.config.server.frontendLocation
            : path.join(__dirname, '../../app/web/angular/dist');
        this.logger.info(`Frontend app served from: ${ngApp}`);
        this.app.use(NG_APP_ROUTE, serveStatic(ngApp));
    }
    routeToApi() {
        this.logger.info('Configuring routes');
        let router;
        router = express.Router();
        let home = new HomeRoute_1.Home();
        router.get('/api', home.index.bind(home.index));
        this.app.use(router);
    }
    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                this.logger.error('Port requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                this.logger.error('Port is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    onListening() {
        let addr = this.server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        this.logger.info('Web server listening on ' + bind);
    }
};
WebServer = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Symbols_1.Symbols.IConfiguration)),
    __metadata("design:paramtypes", [Configuration_1.Configuration])
], WebServer);
exports.WebServer = WebServer;
//# sourceMappingURL=WebServer.js.map