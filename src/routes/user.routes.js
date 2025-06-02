import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router()

router.route("/register").post(
    //Bro this is a middleware that simply adds two additional fields to
    //req.body. Ok Mumi? Don't be scared ;) 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(logoutUser)

export default router