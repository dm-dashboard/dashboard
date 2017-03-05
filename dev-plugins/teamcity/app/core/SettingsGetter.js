"use strict";
class SettingsGetterFactory {
    constructor(logger, mongo) {
        this.logger = logger;
        this.mongo = mongo;
    }
    getInstance(plugin) {
        return new SettingsGetter(plugin, this.mongo, this.logger);
    }
}
exports.SettingsGetterFactory = SettingsGetterFactory;
class SettingsGetter {
    constructor(plugin, mongo, logger) {
        this.plugin = plugin;
        this.mongo = mongo;
        this.logger = logger;
        this.pluginCollection = mongo.getCollection('packages');
    }
    get() {
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
            }
            else {
                return pluginDetails.settings;
            }
        });
    }
}
exports.SettingsGetter = SettingsGetter;
//# sourceMappingURL=SettingsGetter.js.map