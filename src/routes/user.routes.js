import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router()

router.route("/register").post(
    //Bro this is a middleware that simply adds two additional fields to
    //res.body. Ok Mumi? Don't be scared ;) 
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
export default router