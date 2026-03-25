import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    // Event Details
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: 5000
    },
    type: {
        type: String,
        enum: ['reunion', 'workshop', 'seminar', 'webinar', 'networking', 'cultural', 'sports', 'job-fair', 'other'],
        required: true
    },
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/800x400'
    },

    // Date & Time
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    // Location
    venue: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: String,
    state: String,
    isOnline: {
        type: Boolean,
        default: false
    },
    meetingLink: {
        type: String,
        trim: true
    },

    // Registration
    registrationRequired: {
        type: Boolean,
        default: true
    },
    registrationDeadline: Date,
    capacity: {
        type: Number,
        default: 0  // 0 means unlimited
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    waitlistEnabled: {
        type: Boolean,
        default: false
    },

    // Fees
    isFree: {
        type: Boolean,
        default: true
    },
    fees: {
        type: Number,
        default: 0
    },

    // Participants
    // Participants
    attendees: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        department: String,
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'attended', 'cancelled', 'waitlist'],
            default: 'registered'
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'refunded', 'na'],
            default: 'na'
        }
    }],

    // Organizer
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
    },

    // Engagement
    views: {
        type: Number,
        default: 0
    },

    // Tags
    tags: [{
        type: String,
        trim: true
    }],

    // Feedback
    feedbackEnabled: {
        type: Boolean,
        default: true
    },
    feedback: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for availability
eventSchema.virtual('isAvailable').get(function () {
    return this.capacity === 0 || this.registeredCount < this.capacity;
});

// Virtual for average rating
eventSchema.virtual('averageRating').get(function () {
    if (this.feedback.length === 0) return 0;
    const sum = this.feedback.reduce((acc, f) => acc + f.rating, 0);
    return (sum / this.feedback.length).toFixed(1);
});

// Indexes
eventSchema.index({ organizer: 1 });
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ type: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
