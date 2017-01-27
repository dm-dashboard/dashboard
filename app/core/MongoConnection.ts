import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import { Collection, Db, MongoClient } from 'mongodb';

export class MongoConnection {

    private database: Db;

    constructor(private config: Configuration, private logger: ILogger) {

    }

    connect(): Promise<any> {
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
