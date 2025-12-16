import mongoose from "mongoose"
import { User } from "../Models/user.js"
import jwt from 'jsonwebtoken';

export async function updateProject(req, res){
    try{
        const {projectdata} = req.body
        const projectId = projectdata.meta.Id
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
        if(!userid || !projectId || !projectdata){
            return res.status(400).json({
                success: false,
                message: 'userid, projectId, and projectdata are required'
            })
        }

        // Validate ObjectId
        if(!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            })
        }

        // Find user and update specific project by meta.id
        console.log(`projectId`, projectId)
        const user = await User.findByIdAndUpdate(
            userid,
            { 
                $set: { 
                    "projects.$[elem]": projectdata 
                }
            },
            { 
                arrayFilters: [{ "elem.meta.Id": projectId }],
                new: true,
                runValidators: true
            }
        )

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Project successfully updated',
            data: {
                project: projectdata,
                user: user.toPublicProfile()
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating project'
        });
        console.error('updateProject error:', error)
    }
}