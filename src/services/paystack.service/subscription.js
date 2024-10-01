const request = require('./utils/request');
const post = request.post;
const get = request.get;

class Subscription {
    /*
        create subscription
    */
    static async Create(subscriptionData) {
        if (!subscriptionData?.plan || !subscriptionData?.customer || subscriptionData?.authorization) {
            return null;
        }
        const postData = {
            customer: subscriptionData.customer,
            plan: subscriptionData.plan,
            authorization: subscriptionData.authorization,
        };
        const data = post('/subscription', postData);
        if (!data) {
            throw new InternalServerError('subscription failed');
        }
        return data;
    }

    /*
		list subscriptions
	*/
    static async List() {}
    /*
		fetch a subscription
	*/
    static async Fetch() {}
    /*
		enable subscription (enabled by default)
	*/
    static async Enable() {}
    /*
		disable subscription
	*/
    static async Disable() {}
    /*
		update subscription
	*/
    static async Update() {}
}

module.exports = Subscription;
