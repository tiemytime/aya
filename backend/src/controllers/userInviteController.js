const crypto = require('crypto');
const UserInvite = require('../models/UserInvite');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Send invitation
const sendInvite = catchAsync(async (req, res, next) => {
  const { recipientEmail, message } = req.body;
  const senderId = req.user.id;

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email: recipientEmail });
  if (existingUser) {
    return next(new AppError('A user with this email address already exists', 400));
  }

  // Check if there's already a pending invitation to this email from this sender
  const existingInvite = await UserInvite.findOne({
    senderId,
    recipientEmail,
    status: 'pending',
    expiresAt: { $gt: new Date() }
  });

  if (existingInvite) {
    return next(new AppError('You have already sent an invitation to this email address', 400));
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');

  // Create invitation
  const invitation = await UserInvite.create({
    senderId,
    recipientEmail,
    token,
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  // Send email
  try {
    const emailResult = await emailService.sendInvitationEmail(
      recipientEmail,
      req.user.username,
      token,
      message
    );

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        invitation: {
          id: invitation._id,
          recipientEmail: invitation.recipientEmail,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
          createdAt: invitation.createdAt
        },
        emailPreview: emailResult.preview || false
      }
    });
  } catch (error) {
    // If email fails, remove the invitation
    await UserInvite.findByIdAndDelete(invitation._id);
    return next(new AppError('Failed to send invitation email', 500));
  }
});

// Get sent invitations
const getSentInvites = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const invitations = await UserInvite.find({ senderId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await UserInvite.countDocuments({ senderId: req.user.id });

  res.status(200).json({
    success: true,
    data: {
      invitations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Get invitation by token
const getInviteByToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const invitation = await UserInvite.findOne({ token })
    .populate('senderId', 'username email');

  if (!invitation) {
    return next(new AppError('Invitation not found', 404));
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();
    return next(new AppError('This invitation has expired', 400));
  }

  if (invitation.status !== 'pending') {
    return next(new AppError('This invitation is no longer valid', 400));
  }

  res.status(200).json({
    success: true,
    data: {
      invitation: {
        id: invitation._id,
        recipientEmail: invitation.recipientEmail,
        inviterName: invitation.senderId.username,
        inviterEmail: invitation.senderId.email,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt
      }
    }
  });
});

// Accept invitation
const acceptInvite = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const invitation = await UserInvite.findOne({ token });

  if (!invitation) {
    return next(new AppError('Invitation not found', 404));
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();
    return next(new AppError('This invitation has expired', 400));
  }

  if (invitation.status !== 'pending') {
    return next(new AppError('This invitation is no longer valid', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: invitation.recipientEmail });
  if (existingUser) {
    return next(new AppError('A user with this email address already exists', 400));
  }

  // Mark invitation as accepted
  invitation.status = 'accepted';
  invitation.acceptedAt = new Date();
  await invitation.save();

  res.status(200).json({
    success: true,
    message: 'Invitation accepted successfully',
    data: {
      invitation: {
        id: invitation._id,
        recipientEmail: invitation.recipientEmail,
        status: invitation.status,
        acceptedAt: invitation.acceptedAt
      }
    }
  });
});

// Cancel invitation
const cancelInvite = catchAsync(async (req, res, next) => {
  const { inviteId } = req.params;

  const invitation = await UserInvite.findOne({
    _id: inviteId,
    senderId: req.user.id
  });

  if (!invitation) {
    return next(new AppError('Invitation not found', 404));
  }

  if (invitation.status !== 'pending') {
    return next(new AppError('Only pending invitations can be cancelled', 400));
  }

  invitation.status = 'cancelled';
  await invitation.save();

  res.status(200).json({
    success: true,
    message: 'Invitation cancelled successfully',
    data: {
      invitation: {
        id: invitation._id,
        status: invitation.status
      }
    }
  });
});

module.exports = {
  sendInvite,
  getSentInvites,
  getInviteByToken,
  acceptInvite,
  cancelInvite
};
