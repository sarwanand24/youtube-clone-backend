import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { tweets } from "../models/tweets.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";

const createTweet = asyncHandler(async (req, res)=>{
     //Taking String from body and checking its validation
     //Create entry in db and check its validation
     //return res
     const {content} = req.body

     if(!content?.trim()) {
         throw new ApiError(400, "Tweet should not be an empty string")
     } 

     const tweet = await tweets.create({
         owner: new mongoose.Types.ObjectId(req.user._id),
         content
     });


     if(!tweet){
        throw new ApiError(500, "Something Went Wrong While Tweeting")
     }

     return res
     .status(200)
     .json(new ApiResponse(200, tweet, "Tweet Sent Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    //get the userid from params, validate  
    //$match with owner and id in the tweets db and project content
    //validate tweet
    //return res
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "UserId is missing")
    }

    const getTweet = await tweets.aggregate([
        {
            $match: {
               owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    console.log(getTweet);

    if(!getTweet?.length){
        throw new ApiError(400, "NO Tweets for this channel")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, getTweet, "Tweets fetched Successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    //get tweet id from req.params
    //take the content to set from req.body
    //check content validation
    //set in tweet db and validate
    //return res

    const {tweetId} = req.params
    const {content} = req.body

    if(!content?.trim()){
        throw new ApiError(400, "Content is required: Cannot send empty tweet.")
    }
 console.log(new mongoose.Types.ObjectId(tweetId));
    const tweet = await tweets.findByIdAndUpdate(
       new mongoose.Types.ObjectId(tweetId),
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    console.log(tweet);
    if(!tweet){
        throw new ApiError(400, "Error in updating Tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet Updated Successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    //get tweet id from req.params
    //find the id from db and delete
    //return res

    const {tweetId} = req.params

    const tweet = await tweets.findByIdAndDelete(new mongoose.Types.ObjectId(tweetId),
        {
            $unset: {
                _id: 1
            }
        })
        console.log(tweet);
        return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet Deleted Successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}