import { ILogger } from '../core/AppLogger';
import { Configuration } from '../config/Configuration';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as http from 'http';

import { Home } from './routes/HomeRoute';

export class WebServer {

    private server: http.Server;
    private app: express.Application;

    constructor(private config: Configuration, private logger: ILogger) {
        this.app = express();
        this.app.set('view engine', 'pug');
        this.server = http.createServer(this.app);
    }

    start() {
        this.logger.info('Starting web server');
        this.server.listen(this.config.server.port);
        this.server.on('error', (error) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        this.routes();
    }

    private routes() {
        let router: express.Router;
        router = express.Router();

        let home: Home = new Home();

        router.get('/', home.index.bind(home.index));

        this.app.use(router);
    }

    shutdown() {
        this.logger.info('Shutting down');
        this.server.close();
    }

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                this.logger.error('Port requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                this.logger.error('Port is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    onListening() {
        let addr = this.server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        this.logger.info('Web server listening on ' + bind);
    }
}
