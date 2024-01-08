import mongoose from "mongoose";
import { PlayList } from "../models/Playlist.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    //validate name and description
    //set them in db and give owner the id from re.user._id
    //return res

    if(!(name && description)) {
        throw new ApiError(400, "Name and Description of the playlist is required")
    }

    const playlist = await PlayList.create({
          name, 
          description, 
          owner: new mongoose.Types.ObjectId(req.user._id)
    })

    console.log(playlist);
    if(!playlist){
        throw new ApiError(400, "Error in creating PlayList")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "PlayList Created Successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    //$match owner with userId in the playlist db
    //return res
    if(!userId){
        throw new ApiError(400, "Didn't got the userId")
    }

    const playlist = await PlayList.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])

    console.log(playlist);
    if(!playlist){
        throw new ApiError(400, "PlayLists fetching unsuccessfull")
    }
     return res
     .status(200)
     .json(new ApiResponse(200, playlist, "PlayLists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "Didn't get playlistId")
    }

    const playlist = await PlayList.find(new mongoose.Types.ObjectId(playlistId))

    console.log(playlist);
    if(playlist == ""){
        throw new ApiError(400, "PlayList Fetching Unsuccessfull")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "PlayList fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    //validate both id's from params
    //go to playlistId by findbyidandupdate
    //push the videoId in video field 
    //return res

    const {playlistId, videoId} = req.params

    if(!(playlistId && videoId)){
        throw new ApiError(400, "Didn't got the playlistId and VideoId")
    }
   
    const playlist = await PlayList.findByIdAndUpdate(new mongoose.Types.ObjectId(playlistId),
    {
        $push: {
            videos:  new mongoose.Types.ObjectId(videoId)
        }
    })

    if(!playlist){
        throw new ApiError(400, "Failed to add Video to PlayList")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfully added video to playlist"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    //validate both id's from params
    //go to playlistId by findbyidandupdate
    //pull the videoId from the video field 
    //return res

    const {playlistId, videoId} = req.params

    if(!(playlistId && videoId)){
        throw new ApiError(400, "Didn't got the playlistId and VideoId")
    }
   
    const playlist = await PlayList.findByIdAndUpdate(new mongoose.Types.ObjectId(playlistId),
    {
        $pull: {
            videos: new mongoose.Types.ObjectId(videoId)
        }
    })

    if(!playlist){
        throw new ApiError(400, "Failed to remove Video to PlayList")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfully removed video from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    //validate id from params
    //go to id and $unset
    //return res
    
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400, "Didn't got the playlistId")
    }

    const playlist = await PlayList.findByIdAndDelete(new mongoose.Types.ObjectId(playlistId),
    {
        $unset: {
            _id: 1
        }
    })

    console.log(playlist);

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Deleted Playlist Successfully"))
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    //validate the id, name and des
    //go to playlist id and update with $set
    //return res

    const {playlistId} = req.params
    const {name, description} = req.body

    if(!playlistId){
        throw new ApiError(400, "Didn't got the playlistId")
    }
    if(!(name || description)){
        throw new ApiError(400, "Name or description is required")
    }

    const playlist = await PlayList.findByIdAndUpdate(new mongoose.Types.ObjectId(playlistId),
    {
        $set: {
           name, 
           description
        }
    },
    {
        new: true
    })

    console.log(playlist);
    if(!playlist){
    throw new ApiError(400, "Error in updating playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Updated Playlist Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}