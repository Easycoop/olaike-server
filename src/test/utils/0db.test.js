const path = __dirname + '/../../.env.test';
require('dotenv').config({ path });
const { initializeDatabaseConnection } = require('../../database/index');
const { expect } = require('chai');
describe('Database connection and test for env variables', () => {
    it("should return 'test' for NODE_ENV environment variable", async () => {
        expect(process.env.NODE_ENV).to.equal('TEST');
    });

    it("should confirm that 'test' string is in the db name", async () => {
        expect(process.env.PG_DATABASE).to.includes('test');
    });

    it('should connect to POSTGRES database successfully', async () => {
        await initializeDatabaseConnection();
    });

    after(async () => {
        await sequelize.drop();
    });
});
