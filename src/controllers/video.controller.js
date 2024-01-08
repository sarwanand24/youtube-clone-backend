import mongoose from "mongoose"
import {Video} from "../models/video.js"
import {User} from "../models/User.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    //validate userId
    //find user by $match owner and userId
    //use query as a searchTerm by using regex
    //use sort while aggregating videos 
    //use $skip and $limit
    //return res

    if(!userId) {
        throw new ApiError(400, "Didn't got the userId")
    }

    const videos = await Video.aggregate([
         {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                title: { $regex: new RegExp(query, 'i') }
            }
         },
         {
            $sort: {
               [sortBy]: parseInt(sortType)
            }
         },
         {
            $skip: (page - 1)*limit
         },
         {
            $limit: limit
         }
    ])

    console.log(videos);
    if(!videos){
        throw new ApiError(400, "Error in fetching videos")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched Successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    //validate title and description
    //check for video
    //upload to cloudinary
    //create db
    //check for db
    //return res
    const { title, description} = req.body

    if(!(title && description)){
        throw new ApiError(400, "Title and Description is required")
    }

    console.log(req.files);
    const videoPath = req.files?.videoFile[0].path;
    console.log(videoPath)
    const thumbnailPath = req.files?.thumbnail[0].path;
    console.log(thumbnailPath)

    if(!(videoPath || thumbnailPath)){
        throw new ApiError(400, "VideoFile or Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoPath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if(!(videoFile || thumbnail)){
        throw new ApiError(400, "Video or Thumbnail Upload Failed")
    }
    console.log(videoFile);
    console.log(thumbnail);
    console.log(videoFile.url); // VideoFile String url
    console.log(thumbnail.url); // Thumbnail String url
    console.log(videoFile.duration); // Duration of video

    const video = await Video.create({
         videoFile: videoFile.url,
         thumbnail: thumbnail.url,
         duration: videoFile.duration,
         title,
         description,
         isPublished: true,
         owner: new mongoose.Types.ObjectId(req.user._id)
    })

    console.log(video);
    if(!video){
        throw new ApiError(400, "Video Entry in Database Failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Added to Database Successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    // validate id
    //find id from db
    //return res
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Didn't got the videoId")
    }

    const video = await Video.find(new mongoose.Types.ObjectId(videoId))

    if(!video){
        throw new ApiError(400, "Error in fetching video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    //take value from req.body
    //validate the values
    //upload if its thumbnail
    //update in db
    //return res
    const { videoId } = req.params
    const {title, description} = req.body
   console.log(req.file);
    let thumbnailPath;
  if(req.file){
      thumbnailPath = req.file?.path;
  }

  if(!(title && description)){
     throw new ApiError(400, "Title and Description is required")
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);
  console.log(thumbnail)

  const video = await Video.findByIdAndUpdate(new mongoose.Types.ObjectId(videoId),
  {
    $set: {
        title,
        description,
        thumbnail: thumbnail?.url || ""
    }
  },
  {
    new: true
  })

  if(!video){
    throw new ApiError(400, "Error in updating video")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, video, "Video Updated Successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    //validate videoId
    //find the video from db
    //$unset _id
    //return res
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Didn't got the videoId")
    }

    const video = await Video.findByIdAndDelete(new mongoose.Types.ObjectId(videoId),
    {
        $unset: {
            _id: 1
        }
    })

    console.log(video);

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    //validate videoId
    //search in db, if got then delete by $unset _id
    //otherwise create new db for published
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Didn't got the videoId")
    }

    const video = await Video.find(new mongoose.Types.ObjectId(videoId))

    console.log(video[0].isPublished);
    if(!video?.length){
        throw new ApiError(400, "No such video found")
    }

        const publish = await Video.findByIdAndUpdate(new mongoose.Types.ObjectId(videoId),
        {
            $set: {
                isPublished: !video[0].isPublished
            }
        },
        {
            new: true
        })
        return res
    .status(200)
    .json(new ApiResponse(200, publish, "Unpublished: publishStatus fetched Successfully"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}