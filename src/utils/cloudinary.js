import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
dotenv.config({
  path: '../.env'
})

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.Cloudinary_Api_key, 
  api_secret: process.env.Cloudinary_Api_Secret
})

const uploadOnCloudinary = async (localFilePath) => {
     try{// process.env is only working under some conditions and not outside
        if (!localFilePath) return null;
        //upload file on cloudinary
      const response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log("File Uploaded Successfully On Cloudinary"+response.url);
        fs.unlinkSync(localFilePath)
        return response;
     }
     catch(error){
            fs.unlinkSync(localFilePath) //remove the locally saved file as the upload got failed
            return null;
     }
}

export {uploadOnCloudinary}