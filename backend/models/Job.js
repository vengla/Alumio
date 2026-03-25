import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    // Job Details
    title: {
        type: String,
        required: [true, 'Please provide job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true
    },
    companyLogo: {
        type: String,
        default: 'https://via.placeholder.com/100'
    },
    description: {
        type: String,
        required: [true, 'Please provide job description'],
        maxlength: 5000
    },

    // Job Type & Category
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
        required: true
    },
    category: {
        type: String,
        enum: ['software', 'hardware', 'data-science', 'design', 'marketing', 'sales', 'finance', 'hr', 'operations', 'other'],
        required: true
    },

    // Location
    location: {
        type: String,
        required: true,
        trim: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },

    // Requirements
    requirements: [{
        type: String,
        trim: true
    }],
    skills: [{
        type: String,
        trim: true
    }],
    experience: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 10
        }
    },
    education: {
        type: String,
        trim: true
    },

    // Salary
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'INR'
        },
        period: {
            type: String,
            enum: ['hourly', 'monthly', 'yearly'],
            default: 'yearly'
        }
    },

    // Posted By
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isReferralAvailable: {
        type: Boolean,
        default: false
    },

    // Application Details
    applicationDeadline: {
        type: Date,
        required: true
    },
    applicationUrl: {
        type: String,
        trim: true
    },
    applicationEmail: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'closed', 'draft', 'expired'],
        default: 'active'
    },

    // Applications
    applicants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: String,
        email: String,
        resumeUrl: String,
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'rejected', 'accepted'],
            default: 'pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Engagement Metrics
    views: {
        type: Number,
        default: 0
    },
    applicationsCount: {
        type: Number,
        default: 0
    },

    // Admin Moderation
    isApproved: {
        type: Boolean,
        default: true  // Auto-approve for alumni, manual for recruiters
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for faster queries
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1, applicationDeadline: 1 });
jobSchema.index({ type: 1, category: 1 });
jobSchema.index({ createdAt: -1 });

// Auto-expire jobs after deadline
jobSchema.pre('save', function (next) {
    if (this.applicationDeadline && this.applicationDeadline < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
