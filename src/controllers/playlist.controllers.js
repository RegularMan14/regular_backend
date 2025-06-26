import mongoose from "mongoose"
import { Playlist } from "../models/playlist.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

const createPlaylist = asyncHandler( async (req, res) => {
    const {name, description} = req.body
    // create playlist
    
    try {
        if (!( name && description )) {
            throw new ApiError(
                500,
                "Both name and description fields are required"
            )
        }
    
        let playlist = await Playlist.create(
            {
                name: name,
                description: description,
                videos: [],
                owner: new mongoose.Types.ObjectId(req.user?._id)
            }
        )
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    playlist
                },
                "Playlist created successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const getUserPlaylists = asyncHandler( async (req, res) => {
    const {userId} = req.query
    // get user playlists

    try {
        if (!userId) {
            throw new ApiError(
                500,
                "User_id field can't be empty"
            )
        }
    
        let playlists = await Playlist.find(
            {
                owner: new mongoose.Types.ObjectId(userId)
            }
        )
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    playlists
                },
                "Playlists created by user returned successfully"
                )
        )
    } catch (error) {
        return new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const getPlaylistById = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    // get playlist by id

    try {
        if (!playlistId) {
            throw new ApiError(
                500,
                "playlist_id can't be empty"
            )
        }
    
        const playlist = await Playlist.findById(
            new mongoose.Types.ObjectId(playlistId)
        )
    
        if (!playlist) {
            throw new ApiError(
                404,
                "Playlist not found"
            )
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    playlist
                },
                "Playlist fetched successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const addVideoToPlaylist = asyncHandler( async (req, res) => {
    const {playlistId, videoId} = req.query
    // add video to a playlist

    try {
        if (!(playlistId && videoId)) {
            throw new ApiError(
                500,
                "playlistId and/or videoId must not be empty"
            )
        }
    
        const playlist = await Playlist.findById(
            new mongoose.Types.ObjectId(playlistId)
        )
    
        if (!playlist) {
            throw new ApiError(
                500,
                "Playlist not found"
            )
        }
    
        if (playlist.videos.includes(videoId)) {
            throw new ApiError(
                500,
                "Video already present in the playlist"
            )
        } else {
            playlist.videos.push(videoId)
            playlist.save()
        }
        
        return res
        .status (200)
        .json (
            new ApiResponse(
                200,
                {
                    playlist
                },
                "Video added successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const removeVideoFromPlaylist = asyncHandler( async (req, res) => {
    const {playlistId, videoId} = req.query
    // remove a video from a playlist

    try {
        if (!(playlistId && videoId)) {
            throw new ApiError(
                500,
                "playlistId and/or videoId can't be empty"
            )
        }
    
        let playlist = await Playlist.findById(
            new mongoose.Types.ObjectId(playlistId)
        )
        
        if (!playlist) {
            throw new ApiError(
                500,
                "could not fetch the playlist"
            )
        }
        
        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(
                404,
                "Video not present in the playlist"
            )
        } else {
            playlist.videos.splice(playlist.videos.indexOf(videoId), 1)
            playlist.save()
        }
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    playlist
                },
                "Video deleted from playlist successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
})

const deletePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    // delete a playlist

    try {
        if (!playlistId) {
            throw new ApiError(
                500,
                "playlistId can't be empty"
            )
        }
    
        const playlist = await Playlist.findByIdAndDelete(
            new mongoose.Types.ObjectId(playlistId)
        )
    
    
        if (!playlist) {
            throw new ApiError(
                404,
                "Could n't find the playlist"
            )
        }
    
        return res
        .status (200)
        .json(
            new ApiResponse(
                200,
                {
                    playlist
                },
                "deleted playlist successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }

})

const updatePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    const {name, description} = req.body
    // update playlist

    try {
        if (!playlistId) {
            throw new ApiError(
                500,
                "playlistId can't be empty"
            )
        }
    
        if (!name && !description) {
            throw new ApiError(
                500,
                "Atleast one field (name, or description) must be provided"
            )
        }
    
        let playlist = await Playlist.findByIdAndUpdate(
            new mongoose.Types.ObjectId(playlistId),
            {
                name: name,
                description: description
            },
            {
                new: true
            }
        )
    
        return res
        .status (200)
        .json (
            new ApiResponse (
                200,
                {
                    playlist
                },
                "playlist updated successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            error.statusCode,
            error.message
        )
    }
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