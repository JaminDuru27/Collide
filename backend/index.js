import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { userRouter } from './Routes/user.js'
import cookieParser from 'cookie-parser'
const app = express()

//middle wares
app.use(cookieParser())

app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true, limit: "50mb"}))
app.use(express.static(`/frontend`))
app.use('/api/users', userRouter)

// app.get(`/`, (req, res)=>res.send(`jjj`))
// app.get(`/api/users/log`, (req, res)=>res.send(`jjj`))

const uri = `mongodb://localhost:27017/Collide`
mongoose.connect(uri)
.then(()=>{
    console.log(`mongodb connected`)
    app.listen(5000, ()=>console.log(`port 5000`))
})
.catch((err)=>console.error(err))


