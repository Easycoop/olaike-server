/*  
    paystack keys
*/
const paystack_base_url = process.env.PAYSTACK_BASE_URL;
const paystack_secret_key = process.env.PAYSTACK_SECRET_KEY;

/*
    make a post request 
    with preset values
*/
const post = async (path, postData) => {
    const data = await axios.post(`${paystack_base_url}${path}`, postData, {
        headers: {
            Authorization: `Bearer ${paystack_secret_key}`,
            'Content-Type': 'application/json',
        },
    });
    return data;
};

/*
    make a get request 
    with preset values
*/
const get = async (path) => {
    const data = await axios.get(`${paystack_base_url}${path}`, {
        headers: {
            Authorization: `Bearer ${paystack_secret_key}`,
            'Content-Type': 'application/json',
        },
    });
    return data;
};

module.exports = {
    post,
    get,
};
