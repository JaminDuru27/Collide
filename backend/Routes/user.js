import express from 'express'
import { Register } from '../Contollers/register.js'
import { CreateProject } from '../Contollers/createProject.js'
export const userRouter  = express.Router()
userRouter.post('/register', Register)
userRouter.post('/createproject', CreateProject)
userRouter.get('/log', ()=>console.log(`eoute woekd`))

