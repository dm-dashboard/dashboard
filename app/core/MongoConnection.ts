import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
export class MongoConnection {
    constructor(private config: Configuration, private logger: ILogger) {

    }

    close() {
        this.logger.info('Closing connection');
    }
}
