import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/users.models.js'
import { uploadOnCloudinary } from "../utils/uploads.cloudinary.utils.js";
import fs from 'fs';

const registerUser = asyncHandler( async (req, res) => {
    const {fullName, email, userName, password} = req.body;
    
    //Check if the entered details are correct.
    if (
        [fullName, email, userName, password].some(
            (field) => {
                return field?.trim() === ""
            })
    ) {
        throw new ApiError(400, "All these are required")
    }

    //Check if the user already exists
    const userExists =  await User.findOne({
        $or: [{userName}, {email}]
    })
    
    console.log("Files in the request: ", req.files)
    if (userExists) {
        const coverImageLocalPath = req.files?.coverImage[0]?.path
        const avatarLocalPath = req.files?.avatar[0]?.path
        fs.unlinkSync(coverImageLocalPath)
        fs.unlinkSync(avatarLocalPath)
        throw new ApiError(409, "User with email or username already exists")
    }
    else {

        
        //Check if files: avatar and coverImage exist
        const avatarLocalPath = req.files?.avatar[0]?.path
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required")        
        }
        
        const coverImageLocalPath = req.files?.coverImage[0]?.path
        
        //Upload on cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        //And check if its present on the cloud
        if (!avatar) {
            throw new ApiError(400, "Avatar is required")
        }
    
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            userName: userName.toLowerCase()
        })
    
        //Check if user exists
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        
        if (!createdUser) {
            throw new ApiError(500, "Oops! Something went wrong while registering the user :(")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdUser, "New user registered successfully")
        )
    }
})

export {registerUser}