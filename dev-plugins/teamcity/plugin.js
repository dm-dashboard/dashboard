//Test mock plugin

class TeamcityPlugin {
    init(socket, logger, mongo, scheduler, watchdog) {
        this.socket = socket;
        this.logger = logger;
        this.mongo = mongo;
        this.scheduler = scheduler;
        this.watchdog = watchdog;
        logger.info('init');
    }

    shutdown() {
        this.logger.info('shutdown');
    }
}

module.exports = new TeamcityPlugin();

