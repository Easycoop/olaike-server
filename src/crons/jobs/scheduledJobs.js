const { CronJob } = require('cron');
const { logger } = require('../../middlewares/logger');

/* CRON TIME: 0 * * * *
 * Every hour
 */

/* CRON TIME: 10 0 * * *
 * At 12:10AM every day
 */

const dailyJobs = new CronJob('0 */12 * * *', async () => {
    try {
        //Job logic goes here
    } catch (error) {
        logger.error('Error:', error);
    }
});

module.exports = {
    dailyJobs,
};
