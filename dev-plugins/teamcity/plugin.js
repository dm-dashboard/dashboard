//Test mock plugin

module.exports = {
    init : function(socket, logger, mongo, scheduler, watchdog){
        logger.info('init');
    },

    shutdown : function(){
        logger.info('shutdown');
    }
}

