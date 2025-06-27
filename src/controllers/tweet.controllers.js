import mongoose from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/users.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createTweet = asyncHandler ( async (req, res) => {
    // create tweet
    const {content} = req.body

    try {
        if (!content) {
            throw new ApiError(
                400,
                "Bad Request - No content received"
            )
        }
    
        const tweet = await Tweet.create(
            {
                content: content,
                owner: new mongoose.Types.ObjectId(req.user?._id)
            }
        )
    
        if (!tweet) {
            throw new ApiError(
                500,
                "Server can't process your request at the moment"
            )
        }
    
        return  res
        . status (201)
        . json (
            new ApiResponse(
                201,
                {
                    tweet: tweet
                },
                "Tweet was created successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
    )
    }
})

const getUserTweets = asyncHandler ( async (req, res) => {
    // get user tweets
    const {userId} = req.query
    
    try {
        if (!userId) {
            throw new ApiError(
                400,
                "Something went wrong"
            )
        }
    
        const tweets = await Tweet.find (
            {
                owner: new mongoose.Types.ObjectId(userId)
            }
        )
    
        return res
        .status (200)
        .json (
            new ApiResponse(
                200,
                {
                    tweets: tweets
                },
                "Tweets fetched successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const updateTweet = asyncHandler ( async (req, res) => {
    // update tweet
    const {tweetId} = req.query
    const {newContent} = req.body

    try {
        if (!tweetId) {
            throw new ApiError(
                400,
                "Something went wrong"
            )
        }
    
        if (!newContent) {
            throw new ApiError(
                400,
                "Bad request - no content provided"
            )
        }
    
        const tweet = await Tweet.findByIdAndUpdate(
            new mongoose.Types.ObjectId(tweetId),
            {
                content: newContent
            }
        )
    
        if (!tweet) {
            throw new ApiError(
                500,
                "Server can't process your request at the moment"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    tweet: tweet
                },
                "Tweet updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }

})

const deleteTweet = asyncHandler ( async (req, res) => {
    // delete tweet
    const {tweetId} = req.query
    
    try {
        if (!tweetId) {
            throw new ApiError(
                400,
                "Something went wrong"
            )
        }
    
        const tweet = await Tweet.findByIdAndDelete(
            new mongoose.Types.ObjectId(tweetId),
        )
    
        if (!tweet) {
            throw new ApiError(
                500,
                "Server can't process your request at the moment"
            )
        }
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    tweet: tweet
                },
                "Tweet deleted successfully"
            )
        )
    } catch (error) {
        new ApiError(
            error.statusCode,
            error.message
        )
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
}