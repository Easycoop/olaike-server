require('dotenv').config();
const sharp = require('sharp');
import { cloudinary } from '../config/cloudinary';

const uploadtocloudinary = async (fileBuffer, details) => {
    try {
        const options = {
            use_filename: true,
            folder: `Shop-Town/${details.user}/${details.folder}`,
            public_id: details.name,
        };

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(options, (error, result) => {
                    if (error) {
                        console.log('error from uploads ::::::::: ', error);
                        reject(error);
                    } else {
                        console.log('result from upload :::::::: ', result);
                        resolve({ message: 'success', url: result.secure_url });
                    }
                })
                .end(fileBuffer);
        });

        return result;
    } catch (error) {
        console.log(error);
        return { message: 'error', error };
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
        return { message: 'success', result };
    } catch (error) {
        console.log(error);
        return { message: 'error', error };
    }
};

const uploadresizeToCloudinary = async (fileBuffer, details) => {
    const image = sharp(fileBuffer);
    const resizedImage = await image.resize({ width: 200, height: 200 }).toBuffer();
    const options = {
        use_filename: true,
        folder: `Shop-Town/${details.user}/${details.folder}`,
        public_id: details.name,
    };

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(options, (error, result) => {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve({ message: 'success', url: result.secure_url });
            })
            .end(resizedImage);
    });
};

module.exports = {
    uploadtocloudinary,
    uploadresizeToCloudinary,
    deleteFromCloudinary,
};
