import * as winston from 'winston';
import { Configuration } from '../config/Configuration';
import * as winstonDailyRotate from 'winston-daily-rotate-file';
const padFunction = require('right-pad');
const tagWidth = 10;

export interface ILogger {
    info(message: string);
    error(message: string);
    debug(message: string, error?: any);
}

export class AppLogger implements ILogger {
    private logger: winston.LoggerInstance;
    private coreTag = padFunction('core', tagWidth);

    constructor(config: Configuration) {
        let transports: winston.TransportInstance[] = [];

        if (config.logging.toConsole) {
            let consoleOptions: winston.ConsoleTransportOptions = {
                colorize: true,
                json: false,
                humanReadableUnhandledException: false,
                level: config.logging.level,
                name: 'Console',
                prettyPrint: true,
                handleExceptions: false
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
            json: false
        };
        transports.push(new (winstonDailyRotate)(fileOptions));

        this.logger = new winston.Logger({
            transports: transports
        });
    }

    fork(name: string): ILogger {
        let parent = this;
        return {
            info(message: string) {
                parent.info(message, padFunction(name, tagWidth));
            },
            debug(message: string) {
                parent.debug(message, padFunction(name, tagWidth));
            },
            error(message: string, error?: any) {
                parent.error(message, error, padFunction(name, tagWidth));
            }
        };
    }


    info(message: string, tag?: string) {
        this.logger.info(`[${tag ? tag : this.coreTag}] ${message}`);
    }

    debug(message: string, tag?: string) {
        this.logger.debug(message);
    }

    error(message: string, error?: any, tag?: string) {
        this.logger.error(message, error);
    }
}
