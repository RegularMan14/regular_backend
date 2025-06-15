import mongoose, {isValidObjectId} from "mongoose"
import {uploadOnCloudinary} from "../utils/uploads.cloudinary.utils.js"
import {Video} from "../models/video.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const getAllVideos = asyncHandler( async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // get all videos based on query, sort, and pagination
})

const publishAVideo = asyncHandler ( async (req, res) => {
    const { title, description } = req.body
    // get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler ( async (req, res) => {
    const { videoId } = req.params
    // get video by id
})

const updateVideo = asyncHandler ( async (req, res) => {
    const { videoId } = req.params
    // update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler ( async (req, res) => {
    const { videoId } = req.params
    // delete video
})

const togglePublishStatus = asyncHandler ( async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}