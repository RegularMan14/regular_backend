import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription
} from "../controllers/subscription.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()
router.use(verifyJWT)

router.route("/c")
.post(toggleSubscription)
.get(getUserChannelSubscribers)

router.route("/u").get(getSubscribedChannels)

export default router