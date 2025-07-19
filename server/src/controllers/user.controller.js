// Here we are fabricating controller functions for User model

// imports
import { ApiError, ApiResponse } from "../utils/ApiUtils.js"
import { User } from "../models/user.model.js"
import asyncHandler from '../utils/asyncHandler.js'

// literals
const options = {
    httpOnly: true,
    secure: true
}


// defined
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()                      // from { User }
        const refreshToken = user.generateRefreshToken()                    // from { User }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Tokens")
    }
}


const loginUser = asyncHandler(async (req, res) => {

    // req.body -> data
    // take email
    // user in db ?
    // password check
    // access and refresh token generate
    // send cookie

    const { email, password } = req.body
    // console.debug(email)          // check

    if (!(email && password)) throw new ApiError(400, "Provide yo damn details")
    const user = await User.findOne({ email: email.toLowerCase().trim() })                  // when upper 'if' is false

    if (!user) throw new ApiError(404, "User does not exist :(")
    const isPasswordValid = await user.isPasswordCorrect(password)                          // from { User }

    if (!isPasswordValid) throw new ApiError(401, "You are Sus")
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User logged in successfully")
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user?._id) throw new ApiError(401, "User NOT authenticated")

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1                     // removes field from document
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged-Out"))
});


const registerUser = asyncHandler(async (req, res) => {

    // get user details from frontend
    // empty or not validation
    // check user's existance in db
    // if !existing -> create user field's object (password automatically will get encrypted due to user.model.js pre method)
    // upload to db
    // remove password and refresh token field from response
    // check for user creation (user trying to login without signup)
    // return response

    try {
        const { name, email, password } = req.body

        if (!(email && password)) throw new ApiError(400, "Bruh all fields are required")
        const existedUser = await User.findOne({ email: email.toLowerCase().trim() })

        if (existedUser) throw new ApiError(409, "yo just found your ex XD")

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password.trim()
        })

        const createdUser = await User.findById(user._id).select("-password")
        if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user")

        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"))
    } catch (error) {
        throw new ApiError(500, "User registration operation FAILED")
    }
})


const getCurrentUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully")
})


// const refreshAccessToken;
// const changeCurrentPassword;



// exports
export {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    generateAccessAndRefreshTokens
}

