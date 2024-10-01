const { logger } = require('../middlewares/logger');
const { dailyJobs } = require('./jobs/scheduledJobs');

const startCrons = () => {
    // testJob.start();
    dailyJobs.start();

    /* Indicates CRON jobs has been initialised to * start to avoid multiple intialisation of crons
     */
    logger.info('Cron Jobs initialized to start');
    return true;
};

module.exports = {
    startCrons,
};
