import { IPlugin } from './IPlugin';
import { MongoConnection } from './MongoConnection';
import { ILogger } from './AppLogger';
import { Collection } from 'mongodb';

export class SettingsGetterFactory {
    constructor(private logger: ILogger, private mongo: MongoConnection) {

    }

    getInstance(plugin: IPlugin): SettingsGetter {
        return new SettingsGetter(plugin, this.mongo, this.logger);
    }
}

export class SettingsGetter {
    private pluginCollection: Collection;
    constructor(private plugin: IPlugin, private mongo: MongoConnection, private logger: ILogger) {
        this.pluginCollection = mongo.getCollection('packages');
    }

    get(): Promise<any> {
        return this.pluginCollection.findOne({ name: this.plugin.name })
            .then(pluginDetails => {
                if (!pluginDetails) {
                    this.logger.info(`Plugin [${this.plugin.name}] does not have settings stored, setting to default]`);
                    return this.pluginCollection.insert({
                        name: this.plugin.name,
                        lastUpdated: new Date(),
                        settings: this.plugin.defaultSettings
                    })
                        .then(() => {
                            return this.get();
                        });
                } else {
                    return pluginDetails.settings;
                }
            });
    }
}
