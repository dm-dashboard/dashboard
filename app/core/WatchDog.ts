import { Symbols } from '../Symbols';
import { PluginManager } from './PluginManager';
import { Scheduler } from './Scheduler';
import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import * as moment from 'moment';
import { inject, injectable } from 'inversify';

const watchdogTimeout = 10 * 60;
const checkInterval = 30;

export interface IWatchdogKicker {
    (): void;
}

export interface IWatchDog {
    start(logger: ILogger);
    registerPlugin(name: string): IWatchdogKicker;
    shutdown();
}

@injectable()
export class WatchDog implements IWatchDog {
    private logger: ILogger;
    private lastKicks: Map<string, moment.Moment> = new Map();

    constructor( @inject(Symbols.IConfiguration) private config: Configuration,
        @inject(Symbols.IScheduler) private scheduler: Scheduler,
        @inject(Symbols.IPluginManager) private pluginManager: PluginManager) {
    }

    start(logger: ILogger) {
        this.logger = logger;
        this.scheduler.registerCallback(() => this.checkForDeadPlugins(), this, checkInterval * 1000);
    }

    registerPlugin(name: string): IWatchdogKicker {
        this.lastKicks.set(name, moment());
        return () => this.lastKicks.set(name, moment());
    }

    private checkForDeadPlugins() {
        let allOK = true;
        let now = moment();
        this.logger.debug('Watchdog is keeping an eye on:');

        for (let pluginName of this.lastKicks.keys()) {
            let secondsSinceLastKick = now.diff(this.lastKicks.get(pluginName), 'seconds');
            this.logger.debug(`\t${pluginName} (last kick was ${secondsSinceLastKick} seconds ago)`);
            if (secondsSinceLastKick >= watchdogTimeout) {
                this.logger.error(`${pluginName} has not kicked the watchdog in ${secondsSinceLastKick} seconds, restarting`);
                this.pluginManager.restartPlugin(pluginName);
                this.lastKicks.set(pluginName, moment());
                allOK = false;
            }
        }
        if (allOK) {
            this.logger.debug(`All plugins appear to be running OK (i.e. i\'ve heard from them in the last ${watchdogTimeout} seconds)`);
        }
        this.logger.debug('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
    }

    shutdown() {
        this.logger.info('Shutting down');
    }
}
