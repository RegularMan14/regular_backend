import mongoose from "mongoose"
import { Comment } from "../models/comments.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getVideoComments = asyncHandler ( async (req, res) => {
    // get all comments for a video
    const {page, limit = 10, videoId} = req.query

    try {
        if (!videoId) {
            throw new ApiError (
                400,
                "Something went wrong"
            )
        }
    
        //filter object
        const filter = {
            video: new mongoose.Types.ObjectId(videoId)
        }
        
        // Pagination
        let skip = (page - 1) * limit
    
        const comments = await Comment
            . find (filter)
            . skip (skip)
            . limit (limit)
    
        if (comments.length === 0) {
            return res
            .status (200)
            .json ( new ApiResponse (
                200,
                {
                    comments
                },
                "No comments were found for the video"
            ))
        } else {
            return res
            .status (200)
            .json ( new ApiResponse (
                200,
                {
                    comments
                },
                "Comments were fetched successfully"
            ))
        }
    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const addComment = asyncHandler ( async (req, res) => {
    // add a comment to a video
    const {videoId} = req.query
    // console.log(videoId)
    const {content} = req.body

    try {
        if (!videoId) {
            throw new ApiError (
                400,
                "Something went wrong"
            )
        }
    
        const comment = await Comment.create (
            {
                content: content,
                video: new mongoose.Types.ObjectId(videoId),
                owner: new mongoose.Types.ObjectId(req.user?._id)
            }
        )
    
        if (!comment) {
            throw new ApiError(
                500,
                "Error! Comment could not be posted"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    comment
                },
                "Comment posted successfully"
            )
        )
    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const updateComment = asyncHandler ( async (req, res) => {
    // update a comment
    const {commentId} = req.query
    const {content} = req.body
    
    try {
        if (!commentId) {
            throw new ApiError (
                400,
                "Something went wrong"
            )
        }
        
        if (!content) {
            throw new ApiError (
                400,
                "Bad request - content can't be empty"
            )
        }
    
        const comment = await Comment.findByIdAndUpdate (
            new mongoose.Types.ObjectId (commentId),
            {
                content: content
            }
        )
    
        if (!comment) {
            throw new ApiError (
                500,
                "Could not process your request please try again later"
            )
        }
        
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                comment,
                "Comment updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError (
            error.statusCode,
            error.message
        )
    }
})

const deleteComment = asyncHandler ( async (req, res) => {
    // delete a comment
    const {commentId} = req.query
    
    try {
        if (!commentId) {
            throw new ApiError (
                400,
                "Something went wrong"
            )
        }
    
        const comment = await Comment.findByIdAndDelete (
            new mongoose.Types.ObjectId (commentId)
        )
    
        if (!comment) {
            throw new ApiError (
                500,
                "Could not delete the comment. Please try later"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    deletedComment: comment
                },
                "Comment deleted successfully"
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
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}