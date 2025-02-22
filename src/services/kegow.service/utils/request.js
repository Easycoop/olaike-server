const axios = require('axios');

/*  
    Kegow keys
*/
const kegow_base_url = process.env.KEGOW_BASE_URL;
const kegow_secret_key = process.env.KEGOW_SECRET_KEY;


const post = async (path, postData) => {
    try {
        const response = await axios.post(`${kegow_base_url}${path}`, postData, {
            headers: {
                Authorization: `${kegow_secret_key}`,
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
                Authorization: `${kegow_secret_key}`,
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