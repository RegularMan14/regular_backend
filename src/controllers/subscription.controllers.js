import mongoose, { isValidObjectId } from "mongoose"
import {User} from "../models/users.models.js"
import {Subscription} from "../models/subscriptions.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const toggleSubscription = asyncHandler( async (req, res) => {
    const {channelId} = req.query
    try {
        // toggle subscription
        
        if (!channelId) {
            throw new ApiError(
                500,
                "channelId is empty"
            )
        }
    
        let subscription
        const currentUser = req.user?._id
        
        const Subscriber = await Subscription.find({
                subscriber: new mongoose.Types.ObjectId(currentUser),
                channel: new mongoose.Types.ObjectId(channelId)
            }
        )
        
        // console.log()
        if (Subscriber.length != 0) {
            // Unsubscribe
            const unsubscribedResponse = await Subscription.findByIdAndDelete(
                new mongoose.Types.ObjectId(Subscriber[0]._id)
            )
            
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        unsubscribedResponse
                    },
                    "Unsubscribed successfully"
                )
            )
        } else {
            // Subscribe
            subscription = await Subscription.create({
                subscriber: new mongoose.Types.ObjectId(currentUser),
                channel: new mongoose.Types.ObjectId(channelId)
            })
            
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        subscription
                    },
                    "subscribed successfully"
                )
            )
        }
    
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const getUserChannelSubscribers = asyncHandler( async (req, res) => {
    // returns the subscriber list of a channel
    const {channelId} = req.query
    try {
        const subscriberList = await Subscription.find(
            {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        )

        if (subscriberList.length === 0) {
            throw new ApiError(404, "Channel not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    subscriberList
                },
                "Subscriber list retrieved successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }

})

const getSubscribedChannels = asyncHandler( async (req, res) => {
    // return channel list to which user has subscribed
    const {subscriberId} = req.query

    try {
        const subscribedChannelList = await Subscription.find(
            {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        )
    
        if (subscribedChannelList.length !== 0) {
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        subscribedChannelList
                    },
                    "Subscribed channels list fetched successfully"
                )
            )
        }
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}