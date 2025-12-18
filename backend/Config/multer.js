import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js'



// const temp = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder: 'users/images',
//         allowed_formats:["jpg", "png", "webp"]
//     }
// }) 
export const upload = multer({
    dest: "temp/",
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
export default upload

// const pluginfilestorage = new CloudinaryStorage({
//     cloudinary,
//     params:{
//         folder: 'users/images',
//         resourse_type: 'raw',
//     }
// }) 
// export const uploadpluginfile = multer({
//     storage: pluginfilestorage,
//     limits: {
//         fileSize: 20 * 1024 * 1024 //20MB
//     }
// })
