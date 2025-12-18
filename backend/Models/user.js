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
        default: [],
        validate: {
            validator: function(v){
                // Mongoose runs validators differently on updates using operators
                // (e.g. $push). In that case the validator may receive a single
                // element (the pushed project) instead of the whole array.
                // Allow non-array input here (it will be validated at controller
                // level and won't falsely fail the schema validator).
                if (!Array.isArray(v)) return true

                // If user is premium, allow any length
                if (this && this.premium) return true
                // Non-premium users: limit to 2 projects
                return v.length <= 2 || v.length == 0
            },
            message: props => 'Non-premium users can have up to 2 projects'
        }
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
