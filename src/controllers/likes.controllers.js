import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/likes.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const toggleVideoLike = asyncHandler ( async (req, res) => {
    const {videoId} = req.query
    // toggle like on video

    try {
        if (!videoId) {
            throw new ApiError (
                400,
                "Error! Request is malformed"
            )
        }
    
        const likedVideo = await Like.create (
            {
                likedBy: new mongoose.Types.ObjectId (req.user?._id),
                video: new mongoose.Types.ObjectId (videoId)
            }
        )
    
        if (!likedVideo) {
            throw new ApiError (
                500,
                "Video could not be liked"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    likedVideo
                },
                "video liked successfully"
            )
        )

    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const toggleCommentLike = asyncHandler ( async (req, res) => {
    const {commentId} = req.query
    // toggle like on comment

    try {
        if (!commentId) {
            throw new ApiError (
                400,
                "ERROR! Request is malformed"
            )
        }
    
        const likedComment = await Like.create (
            {
                likedBy: new mongoose.Types.ObjectId (req.user?._id),
                comment: new mongoose.Types.ObjectId (commentId)
            }
        )
    
        if (!likedComment) {
            throw new ApiError (
                500,
                "Comment could not be liked"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    commentId
                },
                "comment liked successfully"
            )
        )

    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const toggleTweetLike = asyncHandler ( async (req, res) => {
    const {tweetId} = req.query
    // toggle like on tweet

    try {
        if (!tweetId) {
            throw new ApiError (
                400,
                "Request is malformed"
            )
        }
    
        const likedTweet = await Like.create(
            {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        )
    
        if (!likedTweet) {
            throw new ApiError (
                400,
                "Tweet could not be liked"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    likedTweet
                },
                "Tweet liked successfully"
            )
        )

    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const getLikedVideos = asyncHandler ( async (req, res) => {
    // toggle like on video

    try {
        if (!req.user) {
            throw new ApiError (
                500,
                "User not logged in"
            )
        }
    
        const allDocsLikedByUser = await Like.find (
            {
                likedBy: new mongoose.Types.ObjectId (req.user?._id)
            }
        )
        .select (
            "likedBy video"
        )

        // project only those users that have a valid video id 
        const allVideosLikedByUser = allDocsLikedByUser
        .filter ( (doc) => isValidObjectId( doc.video ) === true )

        if (!allVideosLikedByUser) {
            throw new ApiError (
                500,
                "Could not fetch the videos liked by user."
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    allVideosLikedByUser
                },
                "All videos liked by user fetched successfully"
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
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}