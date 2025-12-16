import { User } from "../Models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function Login(req, res){
    try{
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite:`lax`,
            secure:false,
        })
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        console.log(`login successfull`)
        res.status(200).json({
            success: true,
            data: user.toPublicProfile(),
            token,
            message: 'Login successful'
        });
    
    } catch(err){
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Internal server error'
        });
    }
}