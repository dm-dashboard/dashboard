import { SettingsGetter } from './SettingsGetter';
import { IWatchdogKicker } from './WatchDog';

import { ILogger } from './AppLogger';
import { MongoConnection } from './MongoConnection';
import { SocketManager } from './SocketManager';
import { Scheduler } from './Scheduler';

export interface IPlugin {
    name: string;
    defaultSettings: any;

    init(logger: ILogger, settingsGetter: SettingsGetter);
    shutdown();
}
