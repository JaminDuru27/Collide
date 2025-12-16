import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import { projectSchema } from "../Schemas/projectSchema.js";
const userSchema = new mongoose.Schema({
    isVerified: {
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        required: [true, `Username is required`],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't include password in queries by default
    },
    projects:{
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    premium: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },

})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try{
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(err){
        next(err)
    }
})

userSchema.methods.toPublicProfile = function(){
    return {
        // id: this._id,
        username: this.username,
        email: this.email,
        projects: this.projects,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    }
}
export const User = mongoose.model('Collide', userSchema, `Users`)
