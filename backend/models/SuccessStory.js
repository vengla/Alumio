import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema({
    // Submitter
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Story Details
    title: {
        type: String,
        required: [true, 'Please provide story title'],
        trim: true,
        maxlength: 200
    },
    story: {
        type: String,
        required: [true, 'Please provide the success story'],
        maxlength: 5000
    },

    // Achievement Details
    achievementType: {
        type: String,
        enum: ['award', 'promotion', 'startup', 'publication', 'patent', 'certification', 'milestone', 'other'],
        required: true
    },
    achievementDate: {
        type: Date,
        required: true
    },

    // Media
    featuredImage: {
        type: String,
        default: 'https://via.placeholder.com/800x600'
    },
    additionalImages: [{
        type: String
    }],
    videoUrl: String,

    // Professional Details
    currentRole: String,
    currentOrganization: String,
    recognitionReceived: String,

    // Impact
    impact: {
        type: String,
        maxlength: 1000
    },

    // Tags & Categories
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        enum: ['academic', 'entrepreneurship', 'corporate', 'social-impact', 'innovation', 'arts', 'sports', 'other'],
        required: true
    },

    // Moderation
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'featured'],
        default: 'pending'
    },
    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moderatedAt: Date,
    moderationNotes: String,

    // Featured Story
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredAt: Date,
    featuredOrder: {
        type: Number,
        default: 0
    },

    // Engagement
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Comments
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Sharing
    shareCount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for like count
successStorySchema.virtual('likesCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
successStorySchema.virtual('commentsCount').get(function () {
    return this.comments ? this.comments.length : 0;
});

// Indexes
successStorySchema.index({ submittedBy: 1 });
successStorySchema.index({ status: 1, isFeatured: -1 });
successStorySchema.index({ category: 1, status: 1 });
successStorySchema.index({ createdAt: -1 });

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);

export default SuccessStory;
