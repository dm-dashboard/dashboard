import { Scheduler } from './Scheduler';
import { WatchDog } from './WatchDog';
import { MongoConnection } from './MongoConnection';
import { AppLogger } from './AppLogger';
import { Configuration } from '../config/Configuration';
import { SocketManager } from './SocketManager';
import { IPlugin } from './IPlugin';
import * as path from 'path';
import * as fs from 'fs';


export class PluginManager {

    loadedPlugins: IPlugin[] = [];

    constructor(private config: Configuration, private logger: AppLogger,
        private mongo: MongoConnection, private watchdog: WatchDog,
        private scheduler: Scheduler, private socketManager: SocketManager) {
        let location = config.plugins.location;
        if (!location) {
            // tslint:disable-next-line:max-line-length
            throw new Error(`Please set the plugin directory in the config file\n /config/${this.config.environment}.json -> plugins.location\n`);
        }
        if (!fs.existsSync(location)) {
            throw new Error('Plugin directory does not exist, please correct in the config file\n plugins.location');
        }
    }


    load() {
        let location = path.resolve(this.config.plugins.location);
        this.logger.info(`Loading plugins from [${location}]`);
        this.config.plugins.enabled.forEach(plugin => this.loadPlugin(plugin));
    }

    loadPlugin(name: string) {
        this.logger.info(`Loading plugin [${name}]`);
        let mainScript = path.resolve(path.join(this.config.plugins.location, name, 'plugin.js'));
        if (!fs.existsSync(mainScript)) {
            throw new Error(`[${name}] could not be loaded - [${mainScript}] does not exist`);
        }
        let pluginInstance = require(mainScript) as IPlugin;
        pluginInstance.init(this.socketManager, this.logger.fork(name), this.mongo, this.scheduler, this.watchdog);
        this.loadedPlugins[name] = pluginInstance;
    }

    shutdown() {
        this.loadedPlugins.forEach(plugin => plugin.dispose());
    }
}
