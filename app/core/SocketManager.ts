import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import * as socketIO from 'socket.io';
import * as http from 'http';
import { Injectable } from 'injection-js';

@Injectable()
export class SocketManager {
    private socketIOServer: SocketIO.Server;
    private logger: ILogger;

    constructor(private config: Configuration) {

    }

    listen(logger: ILogger, server: http.Server) {
        this.logger = logger;
        this.logger.info('Opening Socket Server');
        this.socketIOServer = socketIO(server);
        this.socketIOServer.on('connection', (socket) => {
            this.logger.debug(`New socket connection on ${socket.client.conn.remoteAddress}`);
        });
    }

    shutdown() {
        this.logger.info('Shutting down');
        this.socketIOServer.close();
    }
}
