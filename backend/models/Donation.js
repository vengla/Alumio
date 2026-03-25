import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    // Donor Information
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Donation Details
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: [1, 'Donation amount must be at least 1']
    },
    currency: {
        type: String,
        default: 'INR'
    },

    // Purpose
    category: {
        type: String,
        enum: ['scholarship', 'infrastructure', 'events', 'research', 'general', 'emergency'],
        required: true
    },
    purpose: {
        type: String,
        trim: true,
        maxlength: 500
    },

    // Payment Details
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'stripe', 'bank-transfer', 'cheque', 'other'],
        default: 'razorpay'
    },
    paymentId: {
        type: String,
        unique: true,
        sparse: true
    },
    orderId: String,
    signature: String,

    // Status
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },

    // Recurring Donation
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringFrequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly'
    },
    recurringEndDate: Date,

    // Receipt
    receiptNumber: {
        type: String,
        unique: true
    },
    receiptUrl: String,
    receiptIssued: {
        type: Boolean,
        default: false
    },
    receiptIssuedAt: Date,

    // Anonymous Donation
    isAnonymous: {
        type: Boolean,
        default: false
    },

    // Tax Exemption
    taxExemptionClaimed: {
        type: Boolean,
        default: false
    },
    taxExemptionCertificate: String,

    // Notes
    notes: {
        type: String,
        trim: true
    },

    // Admin Notes (private)
    adminNotes: {
        type: String,
        trim: true
    },

    // Acknowledgment
    acknowledged: {
        type: Boolean,
        default: false
    },
    acknowledgedAt: Date,
    acknowledgedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate receipt number before saving
donationSchema.pre('save', async function (next) {
    if (!this.receiptNumber && this.status === 'completed') {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Donation').countDocuments();
        this.receiptNumber = `REC-${year}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Indexes
donationSchema.index({ donor: 1 });
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ category: 1 });
donationSchema.index({ receiptNumber: 1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
