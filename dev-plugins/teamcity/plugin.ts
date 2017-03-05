import { SettingsGetter } from '../../app/core/SettingsGetter';
import { IScheduler } from '../../app/core/Scheduler';
import { IWatchDog } from '../../app/core/WatchDog';
import { IMongoConnection } from '../../app/core/MongoConnection';
import { ILogger } from '../../app/core/AppLogger';
import { ISocketManager } from '../../app/core/SocketManager';
import { Symbols } from '../../app/Symbols';
import { IPlugin } from '../../app/core/IPlugin';
import { inject, injectable } from 'inversify';

@injectable()
export class TeamcityPlugin implements IPlugin {
    private logger: ILogger;

    name = 'teamcity';
    settings: SettingsGetter;
    defaultSettings = {
        servers: [
            {
                name: 'Default',
                path: 'http://123'
            }
        ]
    };

    constructor(
        @inject(Symbols.ISocketManager) private socketManager: ISocketManager,
        @inject(Symbols.ISocketManager) private mongo: IMongoConnection,
        @inject(Symbols.ISocketManager) private scheduler: IScheduler,
        @inject(Symbols.ISocketManager) private watchdog: IWatchDog) {
    }

    init(logger: ILogger, settings: SettingsGetter) {
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
}


