import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema({
    // Mentor & Mentee
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Request Details
    topic: {
        type: String,
        required: [true, 'Please provide mentorship topic'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: 1000
    },
    areaOfInterest: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },

    // Session Details
    sessionType: {
        type: String,
        enum: ['one-time', 'recurring'],
        default: 'one-time'
    },
    preferredMode: {
        type: String,
        enum: ['online', 'in-person', 'hybrid'],
        default: 'online'
    },

    // Schedule
    sessions: [{
        scheduledDate: Date,
        duration: {
            type: Number,  // in minutes
            default: 60
        },
        meetingLink: String,
        venue: String,
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
            default: 'scheduled'
        },
        notes: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Communication
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    // Feedback & Rating
    mentorFeedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },
    menteeFeedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },

    // Response
    mentorResponse: {
        type: String,
        trim: true
    },
    respondedAt: Date,

    // Dates
    startedAt: Date,
    completedAt: Date,

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
mentorshipSchema.index({ mentor: 1, status: 1 });
mentorshipSchema.index({ mentee: 1, status: 1 });
mentorshipSchema.index({ createdAt: -1 });

// Prevent duplicate active mentorship requests
mentorshipSchema.index(
    { mentor: 1, mentee: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['pending', 'accepted', 'ongoing'] }
        }
    }
);

const Mentorship = mongoose.model('Mentorship', mentorshipSchema);

export default Mentorship;
