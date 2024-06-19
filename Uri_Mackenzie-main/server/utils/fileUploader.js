const { getPublicId } = require('./helper');

const cloudinary = require('cloudinary').v2;

const uploadMedia = async (file, folder, quality) => {
    let fold = getPublicId(folder);
    const option = { folder: `URI_Mackenzie/${fold}/` }
    if (quality) {
        option.quality = quality;
    }
    option.public_id = `image_${Date.now().toString()}`;
    option.type = 'private';
    option.resource_type = 'auto';
    return await cloudinary.uploader.upload(file.tempFilePath, option);
}

module.exports = uploadMedia;