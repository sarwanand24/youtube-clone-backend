import mongoose from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Comments } from "../models/Comments.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    //validate videoId
    //$match videoId with video
    //use paginate
    //$project content and createdAt updatedAt,
    //validate comment
    //return res
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
    if(!videoId){
        throw new ApiError(400, "Didn't got the videoId")
    }

    const comments = await Comments.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $skip: (page - 1)*limit
        },
        {
            $limit: limit
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if(comments == ""){
        throw new ApiError(400, "Error in fetching all the comments")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comments, "All Comments Fetched Successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    //get videoId from params
    //get content from req.body
    //validate videoId and content
    //create db , owner -> req.userid, 
    // check for db
    //return res

    const {videoId} = req.params
    const {content} = req.body

    if(!(videoId && content)){
        throw new ApiError(400, "videoId and content is required")
    }

    const comment = await Comments.create({
        content,
        owner: new mongoose.Types.ObjectId(req.user._id),
        video: new mongoose.Types.ObjectId(videoId)
    })

    if(!comment){
        throw new ApiError(400, "Error in adding comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    //get commentId from req.params
    //get content from req.body
    //validate commentId and content
    //find comment in db
    //$set content
    //check for db
    //return res

    const {commentId} = req.params
    const {content} = req.body

    if(!(commentId && content)){
        throw new ApiError(400, "CommentId and content is required")
    }

    const comment = await Comments.findByIdAndUpdate(new mongoose.Types.ObjectId(commentId),
    {
        $set: {
            content
        }
    },
    {
        new: true
    })

    if(!comment){
        throw new ApiError(400, "Error in updating comment")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    //get commentId from req.params
    //validate commentId
    //find and delete comment in db
    //$unset _id
    //return res

    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400, "CommentId is required")
    }

    const comment = await Comments.findByIdAndDelete(new mongoose.Types.ObjectId(commentId),
    {
        $unset: {
            _id: 1
        }
    })

    console.log(comment);

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }