import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const {
            search,
            type,
            category,
            location,
            isRemote,
            company,
            page = 1,
            limit = 20
        } = req.query;

        // Build query
        const query = { status: 'active', isApproved: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (type) query.type = type;
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (isRemote === 'true') query.isRemote = true;
        if (company) query.company = { $regex: company, $options: 'i' };

        // Ensure deadline hasn't passed
        query.applicationDeadline = { $gte: new Date() };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const jobs = await Job.find(query)
            .populate('postedBy', 'firstName lastName profilePhoto currentPosition currentCompany')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Job.countDocuments(query);

        res.status(200).json({
            success: true,
            count: jobs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: jobs
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'firstName lastName profilePhoto currentPosition currentCompany email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment views
        job.views += 1;
        await job.save();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Alumni/Recruiter)
export const createJob = async (req, res) => {
    try {
        // Add user to req.body
        req.body.postedBy = req.user.id;

        // Auto-approve for alumni, manual for recruiters
        if (req.user.role === 'alumni') {
            req.body.isApproved = true;
        }

        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: job
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner/Admin)
export const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership or admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner/Admin)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check ownership or admin
        if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

// @desc    Get my posted jobs
// @route   GET /api/jobs/my/posts
// @access  Private
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your jobs',
            error: error.message
        });
    }
};

// @desc    Get job stats
// @route   GET /api/jobs/stats
// @access  Private
export const getJobStats = async (req, res) => {
    try {
        const stats = {
            totalJobs: await Job.countDocuments({ status: 'active', isApproved: true }),
            totalInternships: await Job.countDocuments({
                status: 'active',
                isApproved: true,
                type: 'internship'
            }),
            totalFullTime: await Job.countDocuments({
                status: 'active',
                isApproved: true,
                type: 'full-time'
            }),
            remoteJobs: await Job.countDocuments({
                status: 'active',
                isApproved: true,
                isRemote: true
            }),
            categoryWise: await Job.aggregate([
                { $match: { status: 'active', isApproved: true } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            typeWise: await Job.aggregate([
                { $match: { status: 'active', isApproved: true } },
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ])
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job stats',
            error: error.message
        });
    }
};

// @desc    Apply for a job
// @route   POST /api/jobs/apply
// @access  Private (Student/Alumni)
export const applyJob = async (req, res) => {
    try {
        const { jobId, action } = req.body;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Initialize applicants array
        if (!job.applicants) job.applicants = [];

        const isApplied = job.applicants.some(a => a.userId.toString() === req.user.id);

        if (action === 'apply') {
            if (isApplied) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already applied for this job'
                });
            }

            job.applicants.push({
                userId: req.user.id,
                name: `${req.user.firstName} ${req.user.lastName}`,
                email: req.user.email,
                appliedAt: new Date()
            });
        } else if (action === 'cancel') {
            if (!isApplied) {
                return res.status(400).json({
                    success: false,
                    message: 'You have not applied for this job'
                });
            }
            job.applicants = job.applicants.filter(a => a.userId.toString() !== req.user.id);
        }

        await job.save();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing application',
            error: error.message
        });
    }
};

export default {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getJobStats,
    applyJob
};
