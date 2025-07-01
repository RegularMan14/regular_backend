import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscriptions.models.js"
import { Like } from "../models/likes.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getChannelStats = asyncHandler ( async (req, res) => {
    // get total video views, total subscribers, total videos, total likes
    
    try {
        if (!req.user?._id) {
            throw new ApiError (
                400,
                "User not logged in"
            )
        }
    
        const videos = await Video.find (
            {
                owner: mongoose.Types.ObjectId(req.user?._id)
            }
        )
        
        const subscribers = await Subscription.find (
            {
                subscriber: mongoose.Types.ObjectId(req.user?._id)
            }
        )
    
        let channelStats = {}
        
        channelStats.subscriberCount = subscribers.length   // total users subscribed to my channels
        channelStats.numberOfVideosUploaded = videos.length //total number of videos uploaded by the channel
        let totalViews = 0
        videos.forEach( (video) => {
            totalViews += video.views
        })
        channelStats.totalViews = totalViews

        // total likes for all videos uploaded by a user
        let totalVideoLikes = 0
        videos.forEach( async (video) => {
            let likes = await Like.find (
                {
                    video: new mongoose.Types.ObjectId (video._id)
                }
            )

            totalVideoLikes += likes.length
        })
        channelStats.totalVideoLikes = totalVideoLikes

        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    channelStats
                },
                "Channel stats fetched successfully"
            )
        )

    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const getChannelVideos = asyncHandler ( async (req, res) => {
    // get all videos uploaded by the channel
    try {
        if (!req.user?._id) {
            throw new ApiError (
                400,
                "User not logged in"
            )
        }
    
        const videos = await Video.find (
            {
                owner: mongoose.Types.ObjectId(req.user?._id)
            }
        )

        if (videos.length === 0) {
            throw new ApiError (
                500,
                "Could not fetch"
            )
        }

        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    videos
                },
                "Channel videos fetched successfully"
            )
        )

    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

export {
    getChannelStats,
    getChannelVideos
}