import mongoose from "mongoose"
import {Video} from "../models/video.js"
import {Subscription} from "../models/subscription.model.js"
import {Likes} from "../models/Likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/User.js"
import { Comments } from "../models/Comments.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //get the channelId from req.body
    //aggregate the models to get all info

    const { channelId } = req.params
     console.log(channelId);
    if(!channelId){
        throw new ApiError(400, "channelId is required")
    }

    const video = await Video.aggregate([
        {
         $group: {
           _id: "$owner",
           totalViews: {
             $sum: '$views'
           },
           totalVideo:{
             $sum: 1
           }
         }
       },
       {
         $match: {
           _id: new mongoose.Types.ObjectId(channelId)
         }
       }
     ])

     console.log(video)
     console.log("Total Views :"+ video[0].totalViews)
     console.log("Total Videos :"+video[0].totalVideo)

     const subscription = await Subscription.aggregate([
        {
          $group: {
            _id: "$channel",
            totalSubscribers: {
              $sum: 1
            }
          }
        },
        {
          $match: {
            _id: new mongoose.Types.ObjectId(channelId)
          }
        }
      ])

      console.log(subscription);
      console.log("Total Subscribers: "+ subscription[0].totalSubscribers);

      const like = await Video.aggregate([
        {
         $match: {
           owner: new mongoose.Types.ObjectId(channelId)
         }
       },
       {
         $lookup: {
           from: "likes",
           localField: "_id",
           foreignField: "video",
           as: "likes"
         }
       },
       {
         $unwind : "$likes"
       },
       {
         $group: {
           _id: "null",
           totalLikes: {
             $sum: 1
           }
         }
       }
     ])

     console.log(like);
     console.log("Total Likes: "+ like[0]?.totalLikes);

     const comment = await Video.aggregate([
        {
         $match: {
           owner: new mongoose.Types.ObjectId(channelId)
         }
       },
       {
         $lookup: {
           from: "comments",
           localField: "_id",
           foreignField: "video",
           as: "comments"
         }
       },
       {
         $unwind : "$comments"
       },
       {
         $group: {
           _id: "null",
           totalComments: {
             $sum: 1
           }
         }
       }
     ])

     console.log(comment);
     console.log("Total comments: "+ comment[0]?.totalComments);
    

     var data = [video, subscription, like, comment];

     return res
     .status(200)
     .json(
        new ApiResponse(200, data, "Channel Stats Fetched Successfully")
     )
   
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    //get channelId from req.body
    //use aggregate and find all videos
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "channelId is required")
    }

    const video = await Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(channelId)
          }
        },
        {
          $project:{
            videoFile: 1,
            thumbnail: 1,
            views: 1,
            duration: 1,
            title: 1,
            description: 1
          }
        }
      ])
    
      console.log(video);
   if(!video?.length){
    throw new ApiError(400, "Error in fetching Channel Videos")
   }
      return res
      .status(200)
      .json(new ApiResponse(200, video, "Channel Videos Fetched Successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }