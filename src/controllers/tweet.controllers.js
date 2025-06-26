import mongoose from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createTweet = asyncHandler ( async (req, res) => {
    // create tweet
})

const getUserTweets = asyncHandler ( async (req, res) => {
    // get user tweets
})

const updateTweet = asyncHandler ( async (req, res) => {
    // update tweet
})

const deleteTweet = asyncHandler ( async (req, res) => {
    // delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
}