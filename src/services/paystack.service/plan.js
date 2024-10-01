const request = require('./utils/request');
const post = request.post;
const get = request.get;

class Plan {
    /*
	   create subscription plan
	*/
    static async Create(planData) {
        if (!planData?.name || !planData?.interval || !planData?.amount || !planData?.currency) {
            return null;
        }
        const postData = {
            name: planData.name,
            interval: planData.interval,
            amount: planData.amount,
            currency: planData.currency,
        };

        const data = await post('/plan', postData);
        if (!data) {
            throw new InternalServerError('subscription plan not created');
        }
        return data;
    }
    /*
		list subscription plans
	*/
    static async List() {}
    /*
		fetch a subscription plan
	*/
    static async Fetch() {}
    /*
		update subscription plan
	*/
    static async Update() {}
}

module.exports = Plan;
