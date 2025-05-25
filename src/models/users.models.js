import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt, { compare } from "bcrypt"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,   //Cloud URL
        required: true,
    },
    coverImage: {
        type: String,   //Cloud URL
    },
    password: {
        type: String,
        required: [true, 'Password is Required!'],
    },
    refreshToken: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ]
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if (!this.isModified('password'))
        return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.passsword)
}

userSchema.methods.generateAccessToken = function () {
    jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
            _id: this._id,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)