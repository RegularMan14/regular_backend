import mongoose, {isValidObjectId} from "mongoose"
import {uploadOnCloudinary} from "../utils/uploads.cloudinary.utils.js"
import {Video} from "../models/video.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import fs from "fs"

const getAllVideos = asyncHandler( async (req, res) => {
    // get all videos based on query, sort, and pagination
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
})

const publishAVideo = asyncHandler ( async (req, res) => {
    // get video, upload to cloudinary, create video
    const { title, description } = req.body

    
    // check if the video already exists on the database
    const videoExists = await Video.findOne({
        $or: [{title}, {description}]
    })
    // If present, then delete the video from the local server, and throw error
    if (videoExists) {
        const videoPath = req.files?.video[0]?.path
        fs.unlinkSync(videoPath)
        throw new ApiError(409, "Video already exists!")
    } else {
        // If not present, stage it on the local server for upload
        // Check if file exists
        const videoPath = req.files?.video[0]?.path
        const thumbnailPath = req.files?.thumbnail[0]?.path
        
        if (!videoPath) {
            throw new ApiError(400, "Video is required")
        }
        if (!thumbnailPath) {
            throw new ApiError(400, "Thumbnail is required")
        }

        // Upload the video to cloud
        const Video = await uploadOnCloudinary(videoPath)
        const Thumbnail = await uploadOnCloudinary(thumbnailPath)

        if (!Video) {
            throw new ApiError(500, "Could not upload the video")
        }
        if (!Thumbnail) {
            throw new ApiError(500, "Could not upload the Thumbnail")
        }
        // Take the response URL and upload it to database

        const video = await User.create(
            {
                videoFile: Video.url,
                thumbnail: Thumbnail.url,
                title,
                description,
                // duration,
                // views,
                // isPublished,
                // owner
            }
        )
        
        const publishedVideo = User.findById(video._id)
        // .select(
        //     ""
        // )

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    videoPublished: publishedVideo
                },
                "Video published successfully"
            )
        )
    }
    // send response

})

const getVideoById = asyncHandler ( async (req, res) => {
    // get video by id
    const { videoId } = req.params
})

const updateVideo = asyncHandler ( async (req, res) => {
    // update video details like title, description, thumbnail
    const { videoId } = req.params
})

const deleteVideo = asyncHandler ( async (req, res) => {
    // delete video
    const { videoId } = req.params
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