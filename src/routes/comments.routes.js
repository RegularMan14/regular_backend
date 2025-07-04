import { Router } from "express";
import { 
    addComment,
    deleteComment,
    updateComment,
    getVideoComments
 } from "../controllers/comments.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router()

router.use(verifyJWT)

router.route("/").get(getVideoComments).post(addComment)
router.route("/c").delete(deleteComment).patch(updateComment)

export default router