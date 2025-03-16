const axios = require('axios');

/*  
    Kegow keys
*/
// const kegow_base_url = process.env.KEGOW_BASE_URL;
const kegow_base_url = 'https://kegow-business-api-426lplcxta-ew.a.run.app/api';
// const kegow_secret_key = process.env.KEGOW_SECRET_KEY;
const kegow_secret_key = '19b0ee441908b706a847df421acb3fff3dd250f5b0e35d5ed0360736bb99be18fee24c7b80768b2eff5daf3a7dec5a1e'

const post = async (path, postData) => {
    try {
        const response = await axios.post(`${kegow_base_url}${path}`, postData, {
            headers: {
                Authorization: `bearer ${kegow_secret_key}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error making POST request:', error);
        throw error; 
    }
};


const get = async (path) => {
    try {
        const response = await axios.get(`${kegow_base_url}${path}`, {
            headers: {
                Authorization: `bearer ${kegow_secret_key}`,
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