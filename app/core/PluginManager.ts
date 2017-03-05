import { Symbols } from '../Symbols';
import { SettingsGetter, SettingsGetterFactory } from './SettingsGetter';
import { Scheduler } from './Scheduler';
import { AppLogger, ILogger } from './AppLogger';
import { WatchDog } from './WatchDog';
import { WebServer } from './../web/WebServer';
import { MongoConnection } from './MongoConnection';
import { Configuration } from '../config/Configuration';
import { SocketManager } from './SocketManager';
import { IPlugin } from './IPlugin';
import * as path from 'path';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';

export interface IPluginManager {
    load(logger: ILogger);
    shutdown();
}

@injectable()
export class PluginManager implements IPluginManager {

    private loadedPlugins: Map<string, IPlugin> = new Map();
    private logger: ILogger;
    private settingsGetterFactory: SettingsGetterFactory;

    constructor( @inject(Symbols.IConfiguration) private config: Configuration) {
        let location = config.plugins.location;
        if (!location) {
            // tslint:disable-next-line:max-line-length
            throw new Error(`Please set the plugin directory in the config file\n /config/${this.config.environment}.json -> plugins.location\n`);
        }
        if (!fs.existsSync(location)) {
            throw new Error('Plugin directory does not exist, please correct in the config file\n plugins.location');
        }

        //this.settingsGetterFactory = new SettingsGetterFactory(this.logger, this.mongo);
    }


    load(logger: ILogger) {
        this.logger = logger;

        let location = path.resolve(this.config.plugins.location);
        this.logger.info(`Loading plugins from [${location}]`);
        this.config.plugins.enabled.forEach(plugin => this.loadPlugin(plugin));

        for (let pluginName of this.loadedPlugins.keys()) {
            let plugin = this.loadedPlugins.get(pluginName);
            plugin.init(this.logger.fork(`plugin-${pluginName}`), this.settingsGetterFactory.getInstance(plugin));
        };
    }

    loadPlugin(name: string) {
        this.logger.info(`Loading plugin [${name}]`);
        let mainScript = path.resolve(path.join(this.config.plugins.location, name, 'plugin.js'));
        if (!fs.existsSync(mainScript)) {
            throw new Error(`[${name}] could not be loaded - [${mainScript}] does not exist`);
        }
        let pluginClass = require(mainScript) as IPlugin;
        // let pluginInstance = new pluginClass(this.socketManager, this.appLogger.fork(`plugin-${name}`),
        //     this.mongo, this.scheduler, this.watchdog.registerPlugin(name));
        // this.loadedPlugins.set(name, pluginInstance);
    }

    restartPlugin(name: string) {
        let plugin = this.loadedPlugins.get(name);
        plugin.init(this.logger.fork(`plugin-${name}`), this.settingsGetterFactory.getInstance(plugin));
    }

    shutdown() {
        this.logger.info('Shutting down');
        for (let plugin of this.loadedPlugins.values()) {
            plugin.shutdown();
        };
    }
}
