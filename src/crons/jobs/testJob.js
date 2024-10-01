const { CronJob } = require('cron');
const { logger } = require('../../middlewares/logger');

const job = new CronJob('* * * * *', async () => {
    logger.info(`Test Cron is executing now, Process ${process.pid} ${new Date()}`);
});

module.exports = {
    job,
};
