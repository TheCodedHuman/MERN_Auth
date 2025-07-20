// Here we are fabricating controller functions for User model

// imports
import { ApiError, ApiResponse } from "../utils/ApiUtils.js"
import { User } from "../models/user.model.js"
import asyncHandler from '../utils/asyncHandler.js'
import sendEmail from "../utils/mailSender.js"
import { sendOTP, verifyOTP } from "../utils/OTPutils.js"
import { options } from "../constants.js"


// defined
const generateAccessAndRefreshTokens = async (userId) => {                  // basically cookies
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


const sendOtpToUser = asyncHandler(async (req, res) => {

    // get email and password from frontend
    // check user entered something or not
    // does user exists in db for login
    // generate otp code
    // put otp code and expiry time in User model
    // send cookie

    const { email, password } = req.body
    // console.debug(email)          // check

    if (!(email && password)) throw new ApiError(400, "Username and email are required")
    const user = await User.findOne({ email: email.toLowerCase().trim() })                  // when upper 'if' is false

    if (!user) throw new ApiError(404, "User does not exist :(")
    const isPasswordValid = await user.isPasswordCorrect(password)                          // from { User }

    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials")
    await sendOTP(user)

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                { userId: user._id },
                "OTP sent to email. Proceed to verify.")
        )
})


const verifyOtpFromUser = asyncHandler(async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        throw new ApiError(400, "User ID and OTP are required");
    }
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    try {
        await verifyOTP(user, otp)
    } catch (error) {
        throw new ApiError(401, error.message || "OTP verification failed")
    }


    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Verified and Login successful"));
});


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

        // sending welcome email
        const mailDetails = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to AuthForge',
            text: `Welcome to AuthForge website ${name}! Your account has been created with email id: ${email}`
        }

        try {
            await sendEmail.sendMail(mailDetails)
        } catch (error) {
            console.error("Welcome email FAILED", error.message)
        }

        return res
            .status(201)
            .json(new ApiResponse(200, createdUser, "User registered successfully"))
    } catch (error) {
        if (error instanceof ApiError) throw error;

        throw new ApiError(500, "User registration operation FAILED"); // fallback if it's a weird error
    }
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "Current user fetched successfully")
})



// exports
export {
    sendOtpToUser,
    verifyOtpFromUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    generateAccessAndRefreshTokens
}

