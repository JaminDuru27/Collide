import express from 'express'
import { Register } from '../Contollers/register.js'
import { CreateProject } from '../Contollers/createProject.js'
import { Login } from '../Contollers/login.js'
import { GetProfile } from '../Contollers/getProfile.js'
import { verifyToken } from '../middleware/auth.js'
import { updateProject } from '../Contollers/updateProject.js'
import { UploadImage } from '../Contollers/uploadimage.js'
import upload from '../Config/multer.js'

export const userRouter = express.Router()

userRouter.post('/register', Register)
userRouter.post('/login', Login)
userRouter.get('/profile', verifyToken, GetProfile)
userRouter.post('/uploadimage', verifyToken, upload.single("image"), UploadImage )
userRouter.post('/createproject', CreateProject)
userRouter.post('/updateproject', updateProject)
userRouter.get('/log', ()=>console.log(`route worked`))

