import { Configuration } from './config/Configuration';
import { AppLogger } from './AppLogger';

export class DMDashboard {
    config: Configuration;
    logger: AppLogger;
    env: string;

    constructor() {
        this.config = new Configuration();
        this.env = process.env.NODE_ENV || 'default';
    }

    start() {
        this.logger = new AppLogger(this.config);
        this.logger.info(`DM-Dashboard starting up. Loading Settings for ENV=${this.env}`);
        //Mongo
        //Plugins
        //Scheduler
        //Express
    }
}
