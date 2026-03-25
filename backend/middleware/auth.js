import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Handle Offline/Mock Mode
        if (global.OFFLINE_MODE) {
            // In offline mode, use the token payload directly since DB is unavailable
            req.user = decoded;
            // Add some mock fields expected by controllers if missing
            if (!req.user.role) req.user.role = 'student';
            return next();
        }

        // Get user from token (Real Mode)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is active
        if (!req.user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact admin.'
            });
        }

        // Check if user is approved (except for admin)
        // if (req.user.role !== 'admin' && !req.user.isApproved) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Your account is pending admin approval.'
        //     });
        // }

        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

// Check for specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Continue without user if token is invalid
            req.user = null;
        }
    }

    next();
};

export default { protect, authorize, optionalAuth };
