// Here we are fabricating casual and secured routes

// imports
import { Router } from "express"
import {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    generateAccessAndRefreshTokens
} from "../controllers/user.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"


// literals
const router = Router()


// casual routes
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


// secured routes
router.route("/change-password").get(verifyJWT, getCurrentUser)
router.route("/logout").post(verifyJWT, logoutUser)



// main
export default router
