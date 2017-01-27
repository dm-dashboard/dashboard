import { AppLogger, ILogger } from './core/AppLogger';
import { Configuration } from './config/Configuration';
export class WebServer {
    constructor(private config: Configuration, private logger: ILogger) {

    }

    start() {

    }

    shutdown() {
        this.logger.info('Shutting down');
    }
}
