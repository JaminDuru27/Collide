import mongoose from "mongoose"

export const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, `Project name not given`],
        minlength:[3, `always a minimum of three`],
        trim: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})
