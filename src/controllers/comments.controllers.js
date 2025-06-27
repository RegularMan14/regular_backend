import mongoose from "mongoose"
import {Comment} from "../models/comments.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getVideoComments = asyncHandler ( async (req, res) => {
    // get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
})

const addComment = asyncHandler ( async (req, res) => {
    // add a comment to a video
    const {videoId} = req.params

})

const updateComment = asyncHandler ( async (req, res) => {
    // update a comment
    const {videoId} = req.params
    

})

const deleteComment = asyncHandler ( async (req, res) => {
    // delete a comment
    const {videoId} = req.params
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}