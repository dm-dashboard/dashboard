import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
export class SocketManager {
    constructor(private config: Configuration, private logger: ILogger) {
    }

    shutdown() {
        this.logger.info('Shutting down');
    }
}
