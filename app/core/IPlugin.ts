import { WatchDog } from './WatchDog';
import { ILogger } from './AppLogger';
import { MongoConnection } from './MongoConnection';
import { SocketManager } from './SocketManager';
import { Scheduler } from './Scheduler';

export interface IPlugin {
    init(socketManager: SocketManager, logger: ILogger, mongo: MongoConnection, scheduler: Scheduler, watchdog: WatchDog);
    shutdown();
}
