import mongoose, {isValidObjectId} from "mongoose"
import { v2 as cloudinary } from "cloudinary"
import {uploadOnCloudinary} from "../utils/uploads.cloudinary.utils.js"
import {Video} from "../models/video.models.js"
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

    console.log(req.user)
    console.log(req.files)

    const { title, description } = req.body

    
    // check if the video already exists on the database
    const videoExists = await Video.findOne({
        $or: [{title}, {description}]
    })

    // If present, then delete the video from the local server, and throw error
    if (videoExists) {
        const videoPath = req.files?.videoFile[0]?.path
        fs.unlinkSync(videoPath)
        throw new ApiError(409, "Video already exists!")
    } else {
        // If not present, stage it on the local server for upload
        // Check if file exists
        const videoPath = req.files?.videoFile[0]?.path
        const thumbnailPath = req.files?.thumbnail[0]?.path
        
        if (!videoPath) {
            throw new ApiError(400, "Video is required")
        }
        if (!thumbnailPath) {
            throw new ApiError(400, "Thumbnail is required")
        }

        // Upload the video to cloud
        const videoResponse = await uploadOnCloudinary(videoPath)
        const thumbnailResponse = await uploadOnCloudinary(thumbnailPath)

        if (!videoResponse) {
            throw new ApiError(500, "Could not upload the video")
        }
        if (!thumbnailResponse) {
            throw new ApiError(500, "Could not upload the Thumbnail")
        }
        // Take the response URL and upload it to database

        const video = await Video.create(
            {
                videoFile: videoResponse.url,
                thumbnail: thumbnailResponse.url,
                title,
                description,
                duration: videoResponse.duration,
                isPublished: true,
                views: 0,
                owner: req.user._id
            }
        )
        
        const publishedVideo = await Video.findById(video._id)
        .select(
            "-videoFile -thumbnail"
        )

        const videoPublished = publishedVideo.toJSON()

        // send response
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    videoPublished
                },
                "Video published successfully"
            )
        )
    }

})

const getVideoById = asyncHandler ( async (req, res) => {
    // get video by id
    const { videoId } = req.params
    const video = await Video.findById(
        new mongoose
        .Types
        .ObjectId(videoId)
    )
    
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
    .json(
        new ApiResponse(
            200,
        {
            video
        },
    "Video fetched successfully")
    )
})

const updateVideo = asyncHandler ( async (req, res) => {
    // update video details like title, description, thumbnail
    const { videoId } = req.params

    
})

const deleteVideo = asyncHandler ( async (req, res) => {
    // delete video
    const { videoId } = req.params

    // fetch the video and get the public id
    const video = await Video.findByIdAndDelete(videoId)
    let video_url = video.videoFile
    let thumbnail_url = video.thumbnail
    let arr = video_url.split("/")
    let video_public_id = arr[arr.length - 1].split(".")[0]
    arr = thumbnail_url.split("/")
    let thumbnail_public_id = arr[arr.length - 1].split(".")[0]
    
    // Delete the old video
    cloudinary
    .uploader
    .destroy(video_public_id, 
        {
            resource_type: 'video',
            invalidate: true
        }
    )
    .then(result => console.log(result))
    .catch(e => console.log("Error: ", e))

    // Delete the old thumbnail too
    
    cloudinary
    .uploader
    .destroy(thumbnail_public_id, 
        {
            resource_type: 'image',
            invalidate: true
        }
    )
    .then(result => console.log(result))
    .catch(e => console.log("Error: ", e))

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {},
            "Video deleted successfully"
        )
    )
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