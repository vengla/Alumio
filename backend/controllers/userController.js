import User from '../models/User.js';

// @desc    Get all users (Alumni Directory)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
    try {
        const {
            search,
            role,
            department,
            batch,
            industry,
            city,
            skills,
            isMentorAvailable,
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        const query = { isApproved: true, isActive: true };

        // Apply filters
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { currentCompany: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) query.role = role;
        if (department) query.department = department;
        if (batch) query.batch = batch;
        if (industry) query.industry = industry;
        if (city) query.city = city;
        if (isMentorAvailable === 'true') query.isMentorAvailable = true;

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            query.skills = { $in: skillsArray };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-password')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check visibility settings
        if (user.profileVisibility === 'private' &&
            user._id.toString() !== req.user.id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'This profile is private'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// @desc    Get directory stats
// @route   GET /api/users/stats
// @access  Private
export const getDirectoryStats = async (req, res) => {
    try {
        const stats = {
            totalAlumni: await User.countDocuments({ role: 'alumni', isApproved: true }),
            totalStudents: await User.countDocuments({ role: 'student', isApproved: true }),
            mentorsAvailable: await User.countDocuments({ isMentorAvailable: true, isApproved: true }),
            departmentWise: await User.aggregate([
                { $match: { isApproved: true } },
                { $group: { _id: '$department', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            batchWise: await User.aggregate([
                { $match: { isApproved: true, role: 'alumni' } },
                { $group: { _id: '$batch', count: { $sum: 1 } } },
                { $sort: { _id: -1 } }
            ]),
            industryWise: await User.aggregate([
                { $match: { isApproved: true, role: 'alumni', industry: { $ne: null } } },
                { $group: { _id: '$industry', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching directory stats',
            error: error.message
        });
    }
};

// @desc    Get pending approval users (Admin only)
// @route   GET /api/users/pending
// @access  Private/Admin
export const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending users',
            error: error.message
        });
    }
};

// @desc    Approve user (Admin only)
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // TODO: Send approval email notification

        res.status(200).json({
            success: true,
            message: 'User approved successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving user',
            error: error.message
        });
    }
};

// @desc    Reject user (Admin only)
// @route   PUT /api/users/:id/reject
// @access  Private/Admin
export const rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User rejected',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting user',
            error: error.message
        });
    }
};

export default {
    getUsers,
    getUserById,
    getDirectoryStats,
    getPendingUsers,
    approveUser,
    rejectUser
};
