import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/users.models.js'
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/uploads.cloudinary.utils.js";
import fs from 'fs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (e) {
        throw new ApiError(500, e)
    }
}

//Delete old avatar from cloudinary
const deleteOldAvatar = async function (userId) {

    const user = await User.findById(userId)
    // console.log("User: ", user)
    let url = user.avatar
    let arr = url.split("/")
    let public_id = arr[arr.length - 1].split(".")[0]
    
    cloudinary.uploader
    .destroy(public_id, 
        {
            resource_type: 'image',
            invalidate: true
        }
    )
    .then(result => console.log(result))
    .catch(e => console.log("Error: ", e));
}

//Delete old coverImage from cloudinary
const deleteCoverImage = async function (userId) {

    const user = await User.findById(userId)
    let url = user.coverImage
    let arr = url.split("/")
    let public_id = arr[arr.length - 1].split(".")[0]

    cloudinary.uploader
    .destroy(public_id, 
        {
            resource_type: 'image',
            invalidate: true
        }
    )
    .then(result => console.log(result));
}

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
        const coverImageLocalPath = req.files?.coverImage[0]?.path
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required")        
        }
        
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


const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body
    
    //Atleast one of them should be given ( email or password )
    if (!email && !username) {
        throw new ApiError(400, "Username or email is required.")
    }
    
    //Check if user actually exists in the database
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    
    //If user doesn't exist throw an error
    if (!user) {
        throw new ApiError(404, "User does not exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "User credentials invalid!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully!"
        )
    )
})

const logoutUser = asyncHandler( async (req, res) => {
    //To be continued
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, { user: req.user }, "User logged out")
    )
})

const refreshAccessToken = asyncHandler ( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async (req,res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPassCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPassCorrect) {
        throw new ApiError(400, "Invalid old password")
    }
    if (!newPassword) {
        throw new ApiError(400, "Invalid new password")
    }  
    user.password = newPassword
    await user.save({
        validateBeforeSave: false
    })

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req, res) => {
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: req.user
            },
            "User fetched successfully!"
        )
    )
}) 

const updateAccountDetails = asyncHandler( async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password")


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    )
})

const updateUserAvatar = asyncHandler( async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }
    
    //Delete the image from cloudinary first
    deleteOldAvatar(req.user?._id)
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            }
        },
        {
            new: true
        }
    ).select("-password")
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully"
        )
    )
})

const updateUserCoverImage = asyncHandler( async(req, res) => {
    const coverImageLocalPath = req.file?.path
    
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is missing")
    }
    
    //Delete the image from cloudinary first
    deleteCoverImage(req.user?._id)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading Cover Image")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            }
        },
        {
            new: true
        }
    ).select("-password")
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Cover Image updated successfully"
        )
    )
})

const getUserChannelProfile = asyncHandler( async(req, res) => {
    
    const {userName} = req.query

    if (!userName?.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField:"_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField:"_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler ( async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        avatar: 1,
                                        userName: 1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}