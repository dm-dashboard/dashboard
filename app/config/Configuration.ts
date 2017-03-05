import { IPluginConfig } from './IPluginConfig';
import * as config from 'config';

import { ILoggingConfig } from './ILoggingConfig';
import { IServerConfig } from './IServerConfig';
import { IMongoConfig } from './IMongoConfig';

import { injectable } from 'inversify';

export interface IConfiguration {
    environment: string;
    logging: ILoggingConfig;
    server: IServerConfig;
    mongo: IMongoConfig;
    plugins: IPluginConfig;
    get(key: string): any;

}

@injectable()
export class Configuration implements IConfiguration {
    environment: string;
    logging: ILoggingConfig;
    server: IServerConfig;
    mongo: IMongoConfig;
    plugins: IPluginConfig;

    constructor() {
        this.environment = process.env.NODE_ENV || 'default';

        this.logging = config.get('logging') as ILoggingConfig;
        this.server = config.get('server') as IServerConfig;
        this.mongo = config.get('mongo') as IMongoConfig;
        this.plugins = config.get('plugins') as IPluginConfig;
    }

    get(key: string): any {
        return config.get(key);
    }
}
