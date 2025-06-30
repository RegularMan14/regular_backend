import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/likes.controllers.js"

const router = Router()
router.use (verifyJWT)

router.route ("/v/").post (toggleVideoLike)
router.route ("/c/").post (toggleCommentLike)
router.route ("/t/").post (toggleTweetLike)
router.route ("/").get (getLikedVideos)

export default router