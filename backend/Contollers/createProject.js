import mongoose from "mongoose"
import { User } from "../Models/user.js"
import { GenerateID } from "../utils/generayeId.js"

export async function CreateProject(req, res){
    try{
        const {userid, projectname} = req.body
        //---------------------  Validate ID --------------------------------

        if(!mongoose.Types.ObjectId.isValid(userid)){
            console.log(`isd not valid`)
            return res.status(500).send({
                success:false,
                message: `Id not valid`
            })
        }
        //---------------------  Find User --------------------------------
        
        const user = await User.findByIdAndUpdate(
            userid,
            {$push:{projects:{title: projectname}}},
            {new: true, runValidators:true}
        )
        if(!user){
            console.log(`user not found`)
            return res.status(404).json({
                success: false,
                message: `user not found`
            })
        }
        res.status(201).json({message:`Project successfully added`, data: {id: `---`}})

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile'
    });
    console.error(error.message)
  }
}