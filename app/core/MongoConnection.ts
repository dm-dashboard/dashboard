import {AppLogger} from './AppLogger';
import { Configuration } from '../config/Configuration';
export class MongoConnection {
    constructor(private config: Configuration, private logger : AppLogger) {
        
    }

    close(){

    }
}