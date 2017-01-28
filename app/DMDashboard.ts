import { SocketManager } from './core/SocketManager';
import { PluginManager } from './core/PluginManager';
import { WatchDog } from './core/WatchDog';
import { Scheduler } from './core/Scheduler';
import { Configuration } from './config/Configuration';
import { AppLogger } from './core/AppLogger';
import { WebServer } from './core/WebServer';
import { MongoConnection } from './core/MongoConnection';

export class DMDashboard {
    config: Configuration;
    logger: AppLogger;
    env: string;
    webServer: WebServer;
    mongo: MongoConnection;
    scheduler: Scheduler;
    watchDog: WatchDog;
    pluginManager: PluginManager;
    socketManager: SocketManager;

    constructor() {
        this.config = new Configuration();
    }

    start() {

        try {
            this.logger = new AppLogger(this.config);
            this.logger.info(`DM-Dashboard starting up. Loading Settings for ENV=${this.config.environment}`);

            this.mongo = new MongoConnection(this.config, this.logger.fork('mongo'));
            this.mongo.connect()
                .then(() => {

                    this.webServer = new WebServer(this.config, this.logger.fork('express'));
                    this.webServer.start();

                    this.scheduler = new Scheduler(this.config, this.logger.fork('scheduler'));
                    this.watchDog = new WatchDog(this.config, this.logger.fork('watchdog'), this.scheduler);
                    this.socketManager = new SocketManager(this.config, this.logger.fork('socket-manager'));

                    this.pluginManager = new PluginManager(this.config, this.logger, this.mongo,
                        this.watchDog, this.scheduler, this.socketManager);
                    this.pluginManager.load();

                    this.watchDog.start(this.pluginManager);

                    this.logger.info('All components started, kicking off scheduler');
                    this.scheduler.start()
                        .catch((error) => this.logger.error(error))
                        .then(() => this.shutdown());
                });
        } catch (error) {
            this.logger.error('Could not start up:');
            this.logger.error(error);
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
