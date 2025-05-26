import { v2 } from "cloudinary";
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
        else {
            const response = await v2.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            console.log("file is uploaded on cloudinary", response.url)
            return response
        }
    } catch (e) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}