import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscriptions.models.js"
import { Like } from "../models/likes.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getChannelStats = asyncHandler ( async (req, res) => {
    // get total video views, total subscribers, total videos, total likes
    
})

const getChannelVideos = asyncHandler ( async (req, res) => {
    // get all videos uploaded by the channel
})

export {
    getChannelStats,
    getChannelVideos
}