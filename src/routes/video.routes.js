import { Router } from "express"
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.contollers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.use(verifyJWT);

// Don't know its purpose as of yet. Will update the routes later on
// router.route('/').get(getAllVideos).post(
//     upload.fields([
//         {
//             name: "videoFile",
//             maxCount: 1,
//         },
//         {
//             name: "thumbnail",
//             maxCount: 1,
//         },
//     ]),
//     publishAVideo
// )

router.route('/').get(getAllVideos)

router.route('/publish').post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
)

router.route("/get/:videoId").get(getVideoById)
router.route("/delete/:videoId").delete(deleteVideo)

router.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(
    upload.single(
        "thumbnail"
    ), updateVideo
)

router.route("/toggle/publish/:videoId")
.patch(togglePublishStatus)

export default router