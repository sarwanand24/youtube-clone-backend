import mongoose from "mongoose"
import {Likes} from "../models/Likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    //get userid from req.user._id
    //validate videoId
    //$match video with videoId, likedBy with userid in the Likes db
    //check for the aggregate
    //return res
    const {videoId} = req.params
    
    if(!videoId){
        throw new ApiError(400, "VideoId is required")
    }

    const existinglike = await Likes.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])
 console.log(existinglike);
    if(!existinglike?.length){
        const like = await Likes.create({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })

        console.log(like);
        if(like == ""){
         throw new ApiError(400, "Error in creating new like")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, true, "New Like Created Successfully"))
    }
    console.log(existinglike[0]._id);

    const like = await Likes.findByIdAndDelete(new mongoose.Types.ObjectId(existinglike[0]._id))

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like Removed By the User"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    //get userid from req.user._id
    //validate commentId
    //$match comment with commentId, likedBy with userid in thye Likes db
    //check for the aggregate
    //return res
    const {commentId} = req.params
    
    if(!commentId){
        throw new ApiError(400, "commentId is required")
    }

    const existinglike = await Likes.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId),
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])
 console.log(existinglike);
    if(existinglike !== ""){

        const like = await Likes.create({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })

        console.log(like);
        if(like == ""){
         throw new ApiError(400, "Error in creating new like")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, true, "New Like Created Successfully"))

    }
    console.log(existinglike[0]._id);

    const like = await Likes.findByIdAndDelete(new mongoose.Types.ObjectId(existinglike[0]._id))

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like Removed By the User"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    //get userid from req.user._id
    //validate tweetId
    //$match tweet with tweetId, likedBy with userid in thye Likes db
    //check for the aggregate
    //return res
    const {tweetId} = req.params
    
    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }

    const existinglike = await Likes.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId),
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])
 console.log(existinglike);
    if(existinglike !== ""){

        const like = await Likes.create({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: new mongoose.Types.ObjectId(req.user._id)
        })

        console.log(like);
        if(like == ""){
         throw new ApiError(400, "Error in creating new like")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, true, "New Like Created Successfully"))

    }
    console.log(existinglike[0]._id);

    const like = await Likes.findByIdAndDelete(new mongoose.Types.ObjectId(existinglike[0]._id))

        return res
        .status(200)
        .json(new ApiResponse(200, like, "Like Removed By the User"))

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    //get userid from req.user._id
    //$match likedBy with userid in the likes db
    //and then $group video field
    //return res
    const like = await Likes.aggregate([
         {
            $match: {
              likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
          },
          {
           $group: {
             _id: "$video" 
           }
         },
         {
            $match: {
             _id: { $ne: null }
           }
         }
    ])

    console.log(like);

    if(!like?.length){
        throw new ApiError(400, "No Liked Videos Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, like, "Liked Videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}