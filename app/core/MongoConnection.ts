import { Symbols } from '../Symbols';
import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import { Collection, Db, MongoClient } from 'mongodb';
import { inject, injectable } from 'inversify';

export interface IMongoConnection {
    connect(logger: ILogger): Promise<any>;
    getCollection(collectionName: string): Collection;
    close();
}

@injectable()
export class MongoConnection implements IMongoConnection {

    private database: Db;
    private logger: ILogger;

    constructor( @inject(Symbols.IConfiguration) private config: Configuration) {

    }

    connect(logger: ILogger): Promise<any> {
        this.logger = logger;
        return new MongoClient().connect(this.config.mongo.url)
            .then(db => this.database = db);
    }

    getCollection(collectionName: string): Collection {
        return this.database.collection(collectionName);
    }

    close() {
        this.logger.info('Closing connection');
    }
}
