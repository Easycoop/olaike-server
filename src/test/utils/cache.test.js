const CacheUtil = require('../../utils/cache');
const { describe, it, afterEach } = require('mocha');
const { expect } = require('chai');
const redisClient = require('../../database/redis');
const sinon = require('sinon');

describe('Cache utility', () => {
    afterEach(async () => {
        // Clean up keys used in tests
        await redisClient.del('testKey', 'nonExistingKey');
    });

    describe('saveToCache', () => {
        it('should save value to cache without ttl', async () => {
            const key = 'testKey';
            const value = { name: 'John' };
            await CacheUtil.saveToCache({ key, value });
            // Assert that the key exists in the cache
            const result = await redisClient.get(key);
            expect(result).to.equal(JSON.stringify(value));
        });

        it('should save value to cache with ttl', async () => {
            const key = 'testKey';
            const value = { name: 'John' };
            const ttl = 60;
            await CacheUtil.saveToCache({ key, value, ttl });
            // Assert that the key exists in the cache with a TTL
            const result = await redisClient.ttl(key);
            expect(result).to.be.lessThan(ttl + 1); // Allow some margin for TTL precision
        });
    });

    describe('getFromCache', () => {
        it('should get value from cache', async () => {
            const key = 'testKey';
            const expectedValue = JSON.stringify({ name: 'John' });
            // Save a value to the cache for the test
            await redisClient.set(key, expectedValue);
            const result = await CacheUtil.getFromCache(key);
            expect(result).to.equal(expectedValue);
        });

        it('should return null for non-existing key', async () => {
            const key = 'nonExistingKey';
            const result = await CacheUtil.getFromCache(key);
            expect(result).to.equal(null);
        });
    });

    describe('deleteFromCache', () => {
        it('should delete value from cache', async () => {
            const key = 'testKey';
            // Save a value to the cache for the test
            await redisClient.set(key, 'value');
            await CacheUtil.deleteFromCache(key);
            // Assert that the key no longer exists in the cache
            const result = await redisClient.exists(key);
            expect(result).to.equal(0);
        });

        it('should not throw error for non-existing key', async () => {
            const key = 'nonExistingKey';
            // Deleting a non-existing key should not throw an error
            await CacheUtil.deleteFromCache(key);
        });
    });
});
