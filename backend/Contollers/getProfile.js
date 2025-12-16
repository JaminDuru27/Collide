    import { User } from "../Models/user.js";

export async function GetProfile(req, res){
    try{
        // JWT verification middleware should have added userId to req.user
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - no user ID'
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user.toPublicProfile(),
            message: 'Profile fetched successfully'
        });
    } catch(err){
        console.error('GetProfile error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Internal server error'
        });
    }
}
