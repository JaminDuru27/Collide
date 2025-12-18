// const cloudinary = require('cloudinary')
// const fs = require('fs')
import cloudinary from "../Config/cloudinary.js";
import fs from 'fs'
export async function UploadImage(req,res){
    try{
        if(!req.user){
            return res.status(401).json({message: `User not Authenticated`})
        }
        if(!req.file){
            return res.status(400).json({message: `no image uploaed`})
        }
        const result = await cloudinary.uploader.upload(req.file.path,{
            folder: `users/${req.user.userId}/images`
        })
        fs.unlinkSync(req.file.path)
        req.user.uploadimage = {
            url: result.secure_url,
            public_id: result.public_id,
        }
        await req.user.save()

        res.json({
            message: "image uploaded",
            uploadimage: req.user.uploadimage,
        })

    }catch(err){
        res.status(500).json({error:err})
        console.error(err.message, err)
    }
}