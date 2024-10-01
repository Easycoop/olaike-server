const { redisClient } = require('../database/redis');

class CacheUtil {
    static async saveToCache({ key, value, ttl }) {
        if (ttl) {
            await redisClient.setex(key, ttl, JSON.stringify(value));
        } else {
            await redisClient.set(key, JSON.stringify(value));
        }
    }

    static async getFromCache(key) {
        return await redisClient.get(key);
    }

    static async deleteFromCache(key) {
        await redisClient.del(key);
    }
}

module.exports = CacheUtil;
