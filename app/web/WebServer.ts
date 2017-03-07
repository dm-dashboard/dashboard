import { ILogger } from '../core/AppLogger';
import { Configuration } from '../config/Configuration';
import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as serveStatic from 'serve-static';
import * as cors from 'cors';

import { Home } from './routes/HomeRoute';
import { Injectable } from 'injection-js';

const NG_APP_ROUTE = '/app';


@Injectable()
export class WebServer {
    private app: express.Application;
    private logger: ILogger;
    server: http.Server;

    constructor(private config: Configuration) {
        this.app = express();
        this.server = http.createServer(this.app);
    }

    start(logger: ILogger) {
        this.logger = logger;
        this.logger.info('Starting web server');
        this.server.listen(this.config.server.port);
        this.server.on('error', (error) => this.onError(error));
        this.server.on('listening', () => this.onListening());

        this.enableDebugCors();
        this.setupRewrite();
        this.setupPipeline();

        return this.server;
    }

    shutdown() {
        this.logger.info('Shutting down');
        this.server.close();
    }

    private enableDebugCors() {
        let corsOptions = {
            origin: 'http://localhost:4200'
        };
        this.app.use(cors(corsOptions));
    }

    private setupRewrite() {
        let filesRegex = /^\/(.*\..*$)/;
        let apiRegex = /^\/api\/(.*$)/;
        let socketRegex = /^\/socket.io/;

        this.app.use((req, res, next) => {
            let fileMatch = filesRegex.exec(req.url);
            if (fileMatch) {
                req.url = `${NG_APP_ROUTE}/${fileMatch[1]}`;
            } else if (!apiRegex.test(req.url) && !socketRegex.test(req.url)) {
                req.url = `${NG_APP_ROUTE}/index.html`;
            }
            next();
        });
    }

    private setupPipeline() {
        this.routeToFrontend();
        this.routeToApi();
    }

    private routeToFrontend() {
        let ngApp = this.config.server.frontendLocation
            ? this.config.server.frontendLocation
            : path.join(__dirname, '../../app/web/angular/dist');

        this.logger.info(`Frontend app served from: ${ngApp}`);
        this.app.use(NG_APP_ROUTE, serveStatic(ngApp));
    }

    private routeToApi() {
        this.logger.info('Configuring routes');
        let router: express.Router;
        router = express.Router();

        let home: Home = new Home();

        router.get('/api', home.index.bind(home.index));

        this.app.use(router);
    }

    private onError(error) {
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

    private onListening() {
        let addr = this.server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        this.logger.info('Web server listening on ' + bind);
    }
}
