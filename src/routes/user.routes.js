import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserCoverImage, updateUserAvatar, getUserChannelProfile } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
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

//Secured routes
router.route("/get-current-user").get(getCurrentUser)
router.route("/get-user-channel-profile").get(getUserChannelProfile)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-current-password").post(changeCurrentPassword)
router.route("/update-account-details").post(updateAccountDetails)
router.route("/update-user-avatar").post(updateUserAvatar)
router.route("/update-user-cover-image").post(updateUserCoverImage)

export default router