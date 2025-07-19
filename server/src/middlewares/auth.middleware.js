// Here we are fabricating user verification reusable function

// imports
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiUtils.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


// defined
const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.info(token)         // check

        if (!token) throw new ApiError(401, "Unauthorized: Token missing");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) throw new ApiError(401, "Invalid access Token");
        req.user = user

        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Token verification FAILED")
    }
})

// exports
export default verifyJWT

