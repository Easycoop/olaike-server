const { uploadtocloudinary, deleteFromCloudinary } = require('../middlewares/cloudinary');
const { BadRequestError } = require('../utils/error');
const { generateRandomString } = require('../utils/stringGenerators');

const uploadSingleFile = async (file, details) => {
    const fileBuffer = file.buffer;
    const originalname = file.originalname;
    details.name = await generateRandomString(6);

    const uploadresult = await uploadtocloudinary(fileBuffer, details);
    if (uploadresult.message === 'error') {
        throw new BadRequestError(uploadresult.error.message);
    }
    if (uploadresult.message === 'success') {
        return uploadresult.url;
    }
};

const uploadFiles = async (req, details) => {
    const files = req.files;

    const uploadPromises = files.map((file) => uploadSingleFile(file, details));
    const results = await Promise.all(uploadPromises);

    if (results.length === 0) {
        throw new BadRequestError(`Error uploading files to cloudinary`);
    }

    return results;
};

const deleteFiles = async (urls) => {
    if (!urls || !urls.length) {
        throw new BadRequestError('No URLs found for deletion');
    }

    const deletePromises = urls.map((url) => deleteFromCloudinary(url));
    const results = await Promise.all(deletePromises);

    if (results.length === 0) {
        throw new BadRequestError(`Error deleting files from cloudinary`);
    }

    return results;
};

module.exports = {
    uploadSingleFile,
    uploadFiles,
    deleteFiles,
};
