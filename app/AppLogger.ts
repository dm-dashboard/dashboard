import * as winston from 'winston';
import { Configuration } from './config/Configuration';
import * as winstonDailyRotate from 'winston-daily-rotate-file';

export class AppLogger {
    logger: winston.LoggerInstance;

    constructor(config: Configuration) {
        let transports: winston.TransportInstance[] = [];

        if (config.logging.toConsole) {
            let consoleOptions: winston.ConsoleTransportOptions = {
                colorize: true,
                json: false,
                humanReadableUnhandledException: true,
                level: config.logging.level,
                name: 'Console',
                prettyPrint: true,
                handleExceptions: true
            };
            transports.push(new (winston.transports.Console)(consoleOptions));
        }


        let fileOptions = {
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            dirname: config.logging.path,
            filename: 'dm-dashboard.log',
            handleExceptions: true,
            level: config.logging.level,
            json : false
        };
        transports.push(new (winstonDailyRotate)(fileOptions));

        this.logger = new winston.Logger({
            transports: transports
        });
    }

    info(message: string) {
        this.logger.info(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    error(message: string, error?: any) {
        this.logger.error(message, error);
    }
}
