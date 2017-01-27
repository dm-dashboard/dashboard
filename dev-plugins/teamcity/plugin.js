//Test mock plugin

class TeamcityPlugin {

    constructor(socket, logger, mongo, scheduler, watchdog) {
        this.name = 'teamcity';
        this.defaultSettings = {
            servers: [
                {
                    name: 'Default',
                    path: 'http://123'
                }
            ]
        };
        this.socket = socket;
        this.logger = logger;
        this.mongo = mongo;
        this.scheduler = scheduler;
        this.watchdog = watchdog;
    }

    init(settings) {
        this.settings = settings;
        this.logger.info('init');
        this.settings.get()
            .then(dbSettings => {
                this.logger.debug(dbSettings);
            })
    }

    shutdown() {
        this.logger.info('shutdown');
    }
}

module.exports = TeamcityPlugin;
