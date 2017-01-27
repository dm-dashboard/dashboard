import * as config from 'config';

import { ILoggingConfig } from './ILoggingConfig';
import { IServerConfig } from './IServerConfig';
import { IMongoConfig } from './IMongoConfig';

export class Configuration {
    logging: ILoggingConfig;
    server: IServerConfig;
    mongo: IMongoConfig;

    constructor() {
        this.logging = config.get('logging') as ILoggingConfig;
        this.server = config.get('server') as IServerConfig;
        this.mongo = config.get('mongo') as IMongoConfig;
    }

    get(key: string): any {
        return config.get(key);
    }
}
