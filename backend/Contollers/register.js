import {User} from '../Models/user.js'

export async function Register(req, res){
    try{
        const {username, email, password} = req.body
        
        // Check if user already exists
        const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
        });

        if (userExists) {
            console.log(`user existes`)
            return res.status(400).json({ 
            success: false, 
            message: 'User with this email or username already exists' 
        });
        }
        
        const user = await User.create({    
            username,
            email,
            password,
        })
        user.createdAt = new Date() 
        await user.save()
        console.log(`regiseref sycceddfully`)
        res.status(201).json({
            success: true,
            message: 'User created but could not send verification email'
        });
    }catch(err){
        res.status(400).json({
            message: err.message,
            success: false
        })
        console.log(err.message)
    }
}