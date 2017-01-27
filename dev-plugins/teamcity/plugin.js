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

    refresh() {
        this.settings.get()
            .then(dbSettings => {
                this.logger.debug('Tick');
            });
    }

    init(settings) {
        this.settings = settings;
        this.logger.info('init');
        this.scheduler.registerCallback(this.refresh,this, 5000);
    }

    shutdown() {
        this.logger.info('shutdown');
    }
}

module.exports = TeamcityPlugin;
