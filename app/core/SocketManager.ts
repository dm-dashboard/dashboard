import { ILogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import * as socketIO from 'socket.io';
import * as http from 'http';

export class SocketManager {
    private socketIOServer: SocketIO.Server;

    constructor(private config: Configuration, private logger: ILogger, private server: http.Server) {
        this.logger.info('Opening Socket Server');
        this.socketIOServer = socketIO(this.server);
        this.socketIOServer.on('connection', (socket) => {
            this.logger.debug('New socket connection');
            console.log(socket.client.conn.remoteAddress);
        });
    }

    shutdown() {
        this.logger.info('Shutting down');
        this.socketIOServer.close();
    }
}
