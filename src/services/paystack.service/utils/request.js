const axios = require('axios');

/*  
    Paystack keys
*/
const paystack_base_url = process.env.PAYSTACK_BASE_URL;
const paystack_secret_key = process.env.PAYSTACK_SECRET_KEY;

/*
    Make a POST request 
    with preset values
*/
const post = async (path, postData) => {
    try {
        const response = await axios.post(`${paystack_base_url}${path}`, postData, {
            headers: {
                Authorization: `Bearer ${paystack_secret_key}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error making POST request:', error);
        throw error; // rethrow or handle accordingly
    }
};

/*
    Make a GET request 
    with preset values
*/
const get = async (path) => {
    try {
        const response = await axios.get(`${paystack_base_url}${path}`, {
            headers: {
                Authorization: `Bearer ${paystack_secret_key}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error making GET request:', error);
        throw error;
    }
};

module.exports = {
    post,
    get,
};
