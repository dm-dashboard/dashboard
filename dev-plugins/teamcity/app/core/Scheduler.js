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
const inversify_1 = require("inversify");
class ScheduledItem {
    constructor(interval, context, callback) {
        this.interval = interval;
        this.context = context;
        this.callback = callback;
    }
    schedule() {
        this.timer = setInterval(() => {
            this.callback.apply(this.context);
        }, this.interval);
    }
    cancel() {
        clearInterval(this.timer);
    }
}
let Scheduler = class Scheduler {
    constructor(config) {
        this.config = config;
        this.schedule = [];
    }
    start(logger) {
        this.logger = logger;
        return new Promise((resolve, reject) => {
            for (let scheduleItem of this.schedule) {
                scheduleItem.schedule();
            }
        });
    }
    registerCallback(callback, context, interval) {
        this.schedule.push(new ScheduledItem(interval, context, callback));
    }
    shutdown() {
        for (let scheduleItem of this.schedule) {
            scheduleItem.cancel();
        }
    }
};
Scheduler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Symbols_1.Symbols.IConfiguration)),
    __metadata("design:paramtypes", [Configuration_1.Configuration])
], Scheduler);
exports.Scheduler = Scheduler;
//# sourceMappingURL=Scheduler.js.map