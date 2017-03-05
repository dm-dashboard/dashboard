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
const Symbols_1 = require("../../app/Symbols");
const inversify_1 = require("inversify");
let TeamcityPlugin = class TeamcityPlugin {
    constructor(socketManager, mongo, scheduler, watchdog) {
        this.socketManager = socketManager;
        this.mongo = mongo;
        this.scheduler = scheduler;
        this.watchdog = watchdog;
        this.name = 'teamcity';
        this.defaultSettings = {
            servers: [
                {
                    name: 'Default',
                    path: 'http://123'
                }
            ]
        };
    }
    init(logger, settings) {
        this.logger = logger;
        this.settings = settings;
        this.logger.info('init');
        this.scheduler.registerCallback(this.refresh, this, 5000);
    }
    refresh() {
        this.settings.get()
            .then(dbSettings => {
            this.logger.debug('Tick');
        });
    }
    shutdown() {
        this.logger.info('shutdown');
    }
};
TeamcityPlugin = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Symbols_1.Symbols.ISocketManager)),
    __param(1, inversify_1.inject(Symbols_1.Symbols.ISocketManager)),
    __param(2, inversify_1.inject(Symbols_1.Symbols.ISocketManager)),
    __param(3, inversify_1.inject(Symbols_1.Symbols.ISocketManager)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TeamcityPlugin);
exports.TeamcityPlugin = TeamcityPlugin;
//# sourceMappingURL=plugin.js.map