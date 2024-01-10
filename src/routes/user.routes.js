import {Router} from "express";
import { addToWatchHistory, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, 
    logoutUser, refreshAccessToken, registerUser,
     removeFromWatchHistory,
     updateAccountDetails, updateUserAvatar, updateUserCoverImage }
 from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
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
    registerUser)

router.route("/login").post(loginUser)

//secured Routes

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/password-change").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/update-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

router.route("/addWatchHistory/:videoId").get(verifyJWT, addToWatchHistory)

router.route("/removeWatchHistory/:videoId").get(verifyJWT, removeFromWatchHistory)


export default router
