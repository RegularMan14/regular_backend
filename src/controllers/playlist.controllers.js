import mongoose from "mongoose"
import { Playlist } from "../models/playlist.models"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asynchandler"

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
            200,
            {
                playlists
            },
            "Playlists created by user returned successfully"
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
})

const removeVideoFromPlaylist = asyncHandler( async (req, res) => {
    const {playlistId, videoId} = req.query
    // remove a video from a playlist
})

const deletePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    // delete a playlist
})

const updatePlaylist = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    const {name, description} = req.body
    // update playlist
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