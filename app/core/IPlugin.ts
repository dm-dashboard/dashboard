import { SettingsGetter } from './SettingsGetter';
import { WatchDog } from './WatchDog';
import { ILogger } from './AppLogger';
import { MongoConnection } from './MongoConnection';
import { SocketManager } from './SocketManager';
import { Scheduler } from './Scheduler';

export interface IPlugin {
    name: string;
    defaultSettings: any;

    new (socketManager: SocketManager, logger: ILogger, mongo: MongoConnection,
        scheduler: Scheduler, watchdog: WatchDog): IPlugin;

    init(settingsGetter: SettingsGetter);
    shutdown();
}
