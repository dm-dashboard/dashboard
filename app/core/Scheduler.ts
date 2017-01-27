import { AppLogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
export class Scheduler {
    constructor(private config: Configuration, private logger: AppLogger) {

    }

    start(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 5000);
        });
    }
}