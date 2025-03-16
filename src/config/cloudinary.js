require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_NAME,
     cloud_name: "dufmrhrbp",
    // api_key: process.env.CLOUDINARY_API_KEY,
    api_key: "774296372336238",
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    api_secret: "ebv-rOJD1---aotOR_iHFy51rkM",
});

module.exports = { cloudinary };
