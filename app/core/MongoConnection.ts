import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import { Collection, Db, MongoClient } from 'mongodb';
import { Injectable } from 'injection-js';

@Injectable()
export class MongoConnection {

    private database: Db;
    private logger: ILogger;

    constructor( private config: Configuration) {

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
