import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/User.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    //validate channelId
    //check for existingsubscriber
    //if found unsubscribe
    //else subscribe -- create db
    //return res
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "NO channelId found")
    }

    const existingSubs = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
                subscriber: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    if(!existingSubs?.length){
        const subscribe = await Subscription.create({
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: new mongoose.Types.ObjectId(req.user._id)
        })

        return res
        .status(200)
        .json(new ApiResponse(200, subscribe, "Subscribed to a Channel"))
    }

    const unsubscribe = await Subscription.findByIdAndDelete(new mongoose.Types.ObjectId(existingSubs[0]._id))

    return res
    .status(200)
    .json(new ApiResponse(200, unsubscribe, "Unsubscribed to a Channel"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    //validate channelId
    //$match channelId
    //$project subscriber
    //check for subscriber
    //return res
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "NO channelId found")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            } 
        },
        {
            $project: {
                subscriber: 1
            }
        }
    ])

    if(!subscribers?.length){
        throw new ApiError(400, "No Subscribers Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(400, "NO subscriberId found")
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            } 
        },
        {
            $project: {
                channel: 1
            }
        }
    ])

    if(!channels?.length){
        throw new ApiError(400, "No channels Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channels, "All Channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}