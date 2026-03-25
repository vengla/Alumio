import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // Basic Information
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false  // Don't include password in queries by default
    },
    mobile: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
    },

    // Role & Status
    role: {
        type: String,
        enum: ['alumni', 'student', 'admin', 'recruiter'],
        default: 'alumni',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: true  // Admin approval required
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Profile Information
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true
    },
    profilePhoto: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    bio: {
        type: String,
        maxlength: 500
    },

    // Academic Information
    enrollmentNumber: {
        type: String,
        sparse: true,  // Allow null but must be unique if provided
        trim: true
    },
    collegeId: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,  // e.g., "2015-2019"
        required: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    degree: {
        type: String,  // B.Tech, M.Tech, MBA, etc.
        required: true
    },

    // Professional Information (for alumni)
    currentCompany: {
        type: String,
        trim: true
    },
    currentPosition: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    experience: {
        type: Number,  // Years of experience
        default: 0
    },
    skills: [{
        type: String,
        trim: true
    }],
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,

    // Location
    city: String,
    state: String,
    country: {
        type: String,
        default: 'India'
    },

    // Mentorship
    isMentorAvailable: {
        type: Boolean,
        default: false
    },
    mentorshipAreas: [{
        type: String,
        trim: true
    }],

    // Privacy Settings
    profileVisibility: {
        type: String,
        enum: ['public', 'alumni-only', 'private'],
        default: 'public'
    },
    showEmail: {
        type: Boolean,
        default: false
    },
    showMobile: {
        type: Boolean,
        default: false
    },

    // Notifications
    emailNotifications: {
        type: Boolean,
        default: true
    },
    pushNotifications: {
        type: Boolean,
        default: true
    },

    // Security
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,

}, {
    timestamps: true,  // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Index for faster searches
userSchema.index({ email: 1 });
userSchema.index({ enrollmentNumber: 1 });
userSchema.index({ department: 1, batch: 1 });
userSchema.index({ role: 1, isApproved: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Remove sensitive fields before sending response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.passwordResetToken;
    delete user.passwordResetExpire;
    delete user.loginAttempts;
    delete user.lockUntil;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
