// Here we are fabricating Schema for USER

// imports
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"



// literals
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],   // encryption
        trim: true
    },
    verifyOtp: {
        type: String,
        trim: true,
        default: ''
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


// middleware
userSchema.pre('save', async function(next) {                       // context-this
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 8)             // default: user defo changes password
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)            // this.password = hashed pswd
}




// main
export const User = mongoose.model("User", userSchema)




