import { Symbols } from './Symbols';
import { ISocketManager, SocketManager } from './core/SocketManager';
import { IPluginManager, PluginManager } from './core/PluginManager';
import { IWatchDog, WatchDog } from './core/WatchDog';
import { IScheduler, Scheduler } from './core/Scheduler';
import { Configuration, IConfiguration } from './config/Configuration';
import { ILogger } from './core/AppLogger';
import { IWebServer } from './web/WebServer';
import { IMongoConnection } from './core/MongoConnection';
import { Container } from 'inversify';


export class DMDashboard {
    logger: ILogger;
    env: string;
    webServer: IWebServer;
    mongo: IMongoConnection;
    scheduler: IScheduler;
    watchDog: IWatchDog;
    pluginManager: IPluginManager;
    socketManager: ISocketManager;

    constructor() {

    }

    start(container: Container) {

        try {
            let config = container.get<IConfiguration>(Symbols.IConfiguration);
            this.logger = container.get<ILogger>(Symbols.ILogger);
            this.logger.info(`DM-Dashboard starting up. Loading Settings for ENV=${config.environment}`);
            this.mongo = container.get<IMongoConnection>(Symbols.IMongoConnection);
            this.mongo.connect(this.logger.fork('mongo'))
                .then(() => {

                    this.webServer = container.get<IWebServer>(Symbols.IWebServer);
                    let httpServer = this.webServer.start(this.logger.fork('express'));

                    this.scheduler = container.get<IScheduler>(Symbols.IScheduler);
                    this.watchDog = container.get<IWatchDog>(Symbols.IWatchDog);
                    this.socketManager = container.get<ISocketManager>(Symbols.ISocketManager);
                    this.socketManager.listen(this.logger.fork('socket-manager'), httpServer);

                    this.pluginManager = container.get<IPluginManager>(Symbols.IPluginManager);
                    this.pluginManager.load(this.logger.fork('plugin-manager'));

                    this.watchDog.start(this.logger.fork('watchdog'));

                    this.logger.info('All components started, kicking off scheduler');
                    this.scheduler.start(this.logger.fork('scheduler'))
                        .catch((error) => this.logger.error(error))
                        .then(() => this.shutdown());
                });
        } catch (error) {
            if (this.logger) {
                this.logger.error('Could not start up:');
                this.logger.error(error.message || error);
            } else {
                console.error('Could not start up:');
                console.error(error);
            }
            return;
        }
    }


    shutdown(): Promise<any> {
        return new Promise((resolve) => {
            this.logger.info('Shutting down');
            this.pluginManager.shutdown();
            this.watchDog.shutdown();
            this.socketManager.shutdown();
            this.mongo.close();
            this.webServer.shutdown();
            this.logger.info('Shutting down complete');
            resolve();
        });
    }
}
