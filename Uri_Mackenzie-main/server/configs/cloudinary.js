//  Import
const cloudinary = require('cloudinary').v2;

const connectToCloudinary = (cloudName, apiKey, apiSecret)=>{
    try{
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey, 
            api_secret: apiSecret,
        })
    }catch(err){
        console.log("Cloudinary connection error: ", err);
    }
}

module.exports = connectToCloudinary;