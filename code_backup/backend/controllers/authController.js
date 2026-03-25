import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const {
            email,
            password,
            mobile,
            firstName,
            lastName,
            role,
            enrollmentNumber,
            collegeId,
            department,
            batch,
            graduationYear,
            degree
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Check enrollment number for alumni/students
        if (enrollmentNumber) {
            const existingEnrollment = await User.findOne({ enrollmentNumber });
            if (existingEnrollment) {
                return res.status(400).json({
                    success: false,
                    message: 'Enrollment number already registered'
                });
            }
        }

        // Create user
        const user = await User.create({
            email,
            password,
            mobile,
            firstName,
            lastName,
            role: role || 'alumni',
            enrollmentNumber,
            collegeId,
            department,
            batch,
            graduationYear,
            degree,
            isApproved: role === 'admin' ? true : false,  // Require admin approval for everyone else
        });

        // Return success response (no token, force login)
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please wait for admin approval.',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isApproved: user.isApproved
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked. Please try again later.'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            // Increment login attempts
            user.loginAttempts += 1;

            // Lock account after 5 failed attempts
            if (user.loginAttempts >= 5) {
                user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
            }

            await user.save();

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = Date.now();
        await user.save();

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Check if user is approved
        if (!user.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending approval by an administrator.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
            bio: req.body.bio,
            currentCompany: req.body.currentCompany,
            currentPosition: req.body.currentPosition,
            industry: req.body.industry,
            experience: req.body.experience,
            skills: req.body.skills,
            linkedinUrl: req.body.linkedinUrl,
            githubUrl: req.body.githubUrl,
            portfolioUrl: req.body.portfolioUrl,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            isMentorAvailable: req.body.isMentorAvailable,
            mentorshipAreas: req.body.mentorshipAreas,
            profileVisibility: req.body.profileVisibility,
            showEmail: req.body.showEmail,
            showMobile: req.body.showMobile
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: { token }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful',
        data: {}
    });
};

export default {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    logout
};
