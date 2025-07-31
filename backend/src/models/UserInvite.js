const mongoose = require('mongoose');

const userInviteSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Invite must have a sender'],
  },
  recipientEmail: {
    type: String,
    required: [true, 'Recipient email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  token: {
    type: String,
    required: [true, 'Invite token is required'],
    unique: true,
  },
  status: {
    type: String,
    required: [true, 'Invite status is required'],
    enum: ['pending', 'accepted', 'expired', 'cancelled'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    required: [true, 'Invite expiration date is required'],
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
});

// Index for better query performance
userInviteSchema.index({ senderId: 1, status: 1 });
userInviteSchema.index({ recipientEmail: 1, status: 1 });
userInviteSchema.index({ token: 1 }, { unique: true });
userInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const UserInvite = mongoose.model('UserInvite', userInviteSchema);

module.exports = UserInvite;
