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
                message: 'No token provided'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const userid = decoded.userId
        // Validate input
        if(!userid || !projectdata){
            return res.status(400).json({
                success: false,
                message: 'userid and projectdata are required'
            })
        }

        // Validate ObjectId
        if(!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            })
        }

        // Add ID to project if not present
        if(!projectdata.id){
            projectdata.id = GenerateID();
        }

        // Push project to user
        const user = await User.findByIdAndUpdate(
            userid,
            { $push: { projects: projectdata } },
            { new: true, runValidators: true }
        )

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(201).json({
            success: true,
            message: 'Project successfully added',
            data: {
                project: projectdata,
                user: user.toPublicProfile()
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating project'
        });
        console.error('CreateProject error:', error)
    }
}