// Here we are fabricating controller functions relating to user model but focused on OTP verification

// imports
import { ApiError } from "./ApiUtils.js"
import { OTP_EXPIRY_DURATION } from "../constants.js"
import sendEmail from "./mailSender.js"
import generateCode from "./codeGenerator.js"


// defined
const sendOTP = async (user) => {
    const otp = generateCode()
    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now() + OTP_EXPIRY_DURATION;

    await user.save()

    const mailDetails = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Login OTP',
        text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    try {
        await sendEmail.sendMail(mailDetails)
    } catch (error) {
        console.error("OTP email failed", error.message)
        return false        // helps in email send failure
    }
}


const verifyOTP = async (user, otp) => {

    if (user.verifyOtp !== otp) throw new ApiError(401, "Invalid OTP")
    if (Date.now() > user.verifyOtpExpiredAt) throw new ApiError(401, "OTP Expired")

    // Update verification status
    user.isAccountVerified = true
    user.verifyOtp = ''
    user.verifyOtpExpiredAt = null
    await user.save()

    return true
}



// exports
export {
    sendOTP,
    verifyOTP
}