import {SettingsGetter} from './SettingsGetter';
import {IWatchdogKicker} from './WatchDog';

import { ILogger } from './AppLogger';
import { MongoConnection } from './MongoConnection';
import { SocketManager } from './SocketManager';
import { Scheduler } from './Scheduler';

export interface IPlugin {
    name: string;
    defaultSettings: any;

    new (socketManager: SocketManager, logger: ILogger, mongo: MongoConnection,
        scheduler: Scheduler, watchdog: IWatchdogKicker): IPlugin;

    init(settingsGetter: SettingsGetter);
    shutdown();
}
