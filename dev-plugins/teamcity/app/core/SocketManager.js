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
const socketIO = require("socket.io");
const inversify_1 = require("inversify");
let SocketManager = class SocketManager {
    constructor(config) {
        this.config = config;
    }
    listen(logger, server) {
        this.logger = logger;
        this.logger.info('Opening Socket Server');
        this.socketIOServer = socketIO(server);
        this.socketIOServer.on('connection', (socket) => {
            this.logger.debug(`New socket connection on ${socket.client.conn.remoteAddress}`);
        });
    }
    shutdown() {
        this.logger.info('Shutting down');
        this.socketIOServer.close();
    }
};
SocketManager = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Symbols_1.Symbols.IConfiguration)),
    __metadata("design:paramtypes", [Configuration_1.Configuration])
], SocketManager);
exports.SocketManager = SocketManager;
//# sourceMappingURL=SocketManager.js.map