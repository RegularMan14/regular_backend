import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { env } from "process";

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("This is the response from Cloudinary: ", response)
        console.log("this is the local file path: ", localFilePath)
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (e) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}