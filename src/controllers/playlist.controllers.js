import mongoose from "mongoose"
import { Playlist } from "../models/playlist.models"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asynchandler"

const createPlaylist = asyncHandler( async (req, res) => {
    const {name, description} = req.body
    // create playlist
})

const getUserPlaylists = asyncHandler( async (req, res) => {
    const {userId} = req.query
    // get user playlists
})

const getPlaylistById = asyncHandler( async (req, res) => {
    const {playlistId} = req.query
    // get playlist by id
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