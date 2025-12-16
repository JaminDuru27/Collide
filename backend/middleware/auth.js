import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next){
    try{
        const token = req.cookies?.access_token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch(err){
        console.error('Token verification error:', err.message);
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}
