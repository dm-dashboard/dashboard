import { SettingsGetter, SettingsGetterFactory } from './SettingsGetter';
import { Scheduler } from './Scheduler';
import { AppLogger, ILogger } from './AppLogger';
import { WatchDog } from './WatchDog';
import { MongoConnection } from './MongoConnection';
import { Configuration } from '../config/Configuration';
import { SocketManager } from './SocketManager';
import { IPlugin } from './IPlugin';
import * as path from 'path';
import * as fs from 'fs';


export class PluginManager {

    private loadedPlugins: Map<string, IPlugin> = new Map();
    private logger: ILogger;
    private settingsGetterFactory: SettingsGetterFactory;

    constructor(private config: Configuration, private appLogger: AppLogger,
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
        this.logger = appLogger.fork('plugin-manager');
        this.settingsGetterFactory = new SettingsGetterFactory(this.logger, this.mongo);
    }


    load() {
        let location = path.resolve(this.config.plugins.location);
        this.logger.info(`Loading plugins from [${location}]`);
        this.config.plugins.enabled.forEach(plugin => this.loadPlugin(plugin));
        for (let plugin of this.loadedPlugins.values()) {
            plugin.init(this.settingsGetterFactory.getInstance(plugin));
        };
    }

    loadPlugin(name: string) {
        this.logger.info(`Loading plugin [${name}]`);
        let mainScript = path.resolve(path.join(this.config.plugins.location, name, 'plugin.js'));
        if (!fs.existsSync(mainScript)) {
            throw new Error(`[${name}] could not be loaded - [${mainScript}] does not exist`);
        }
        let pluginClass = require(mainScript);
        let pluginInstance = new pluginClass(this.socketManager, this.appLogger.fork(`plugin-${name}`),
            this.mongo, this.scheduler, this.watchdog) as IPlugin;
        this.loadedPlugins.set(name, pluginInstance);
    }

    shutdown() {
        this.logger.info('Shutting down');
        for (let plugin of this.loadedPlugins.values()) {
            plugin.shutdown();
        };
    }
}
