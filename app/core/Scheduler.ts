import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import { Injectable } from 'injection-js';

class ScheduledItem {

    private timer: NodeJS.Timer;
    constructor(private interval: number, private context: any, private callback: () => void) {

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


@Injectable()
export class Scheduler {
    private schedule: ScheduledItem[] = [];
    private logger: ILogger;

    constructor(private config: Configuration) {

    }

    start(logger: ILogger): Promise<any> {
        this.logger = logger;
        return new Promise((resolve, reject) => {
            for (let scheduleItem of this.schedule) {
                scheduleItem.schedule();
            }
        });
    }

    registerCallback(callback: () => void, context: any, interval: number) {
        this.schedule.push(new ScheduledItem(interval, context, callback));
    }

    shutdown() {
        for (let scheduleItem of this.schedule) {
            scheduleItem.cancel();
        }
    }
}
