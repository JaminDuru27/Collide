import mongoose from "mongoose"
import { User } from "../Models/user.js"
import { GenerateID } from "../utils/generayeId.js"
import jwt from 'jsonwebtoken';

export async function CreateProject(req, res){
    try{
        const {projectdata} = req.body
        const token = req.cookies?.access_token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
                newproject: false,
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const userid = decoded.userId
        // Validate input
        if(!userid || !projectdata){
            return res.status(400).json({
                success: false,
                message: 'userid and projectdata are required',
                newproject: false,
            })
        }

        // Validate ObjectId
        if(!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
                newproject: false,
            })
        }

        //check if project exists
        //find user
        const user = await User.findById(userid)
        let exist, newprojectdata
        user.projects.forEach(project=>{
            if(project.meta.Id === projectdata.meta.Id) {exist = true; newprojectdata = project}
        }) 

        if(exist){
            return res.status(201).json({
                data: {
                    projectdata: newprojectdata,
                    user: user.toPublicProfile(),
                },
                message: `Project Already Exists`,
                success: true,
                newproject: false,
            })
        }
        
            // Enforce project count limit for non-premium users
            const currentCount = (user.projects || []).length
            if(!user.premium && currentCount >= 2){
                return res.status(403).json({
                    success: false,
                    message: 'Project limit reached: upgrade to premium to add more projects',
                    newproject: false,
                })
            }

            // Push project to user
        await User.findByIdAndUpdate(
            userid,
            { $push: { projects: projectdata } },
            { new: true, runValidators: true }
        )

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
                newproject: false,
            })
        }

        res.status(201).json({
            success: true,
            message: 'Project successfully added',
            data: {
                projectdata: projectdata,
                user: user.toPublicProfile()
            },
            newproject: true,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating project'
        });
        console.error('CreateProject error:', error.message)
    }
}