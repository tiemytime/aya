const PrayerNote = require('../models/PrayerNote');
const Light = require('../models/Light');
const UserInteraction = require('../models/UserInteraction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createPrayerNote = catchAsync(async (req, res, next) => {
  const { content, lightId, isPublic } = req.body;

  // Verify that the light exists if lightId is provided
  if (lightId) {
    const light = await Light.findById(lightId);
    if (!light) {
      return next(new AppError('Light not found', 404));
    }
  }

  // Create the prayer note
  const prayerNote = await PrayerNote.create({
    content,
    lightId,
    userId: req.user.id,
    isPublic: isPublic !== undefined ? isPublic : true,
  });

  // Log user interaction
  await UserInteraction.create({
    userId: req.user.id,
    entityType: 'PrayerNote',
    entityId: prayerNote._id,
    action: 'create',
  });

  // Populate the prayer note with user and light details
  const populatedNote = await PrayerNote.findById(prayerNote._id)
    .populate('userId', 'username profilePicture')
    .populate('lightId', 'title');

  res.status(201).json({
    status: 'success',
    data: {
      prayerNote: populatedNote,
    },
  });
});

const likePrayerNote = catchAsync(async (req, res, next) => {
  const { noteId } = req.params;

  // Check if prayer note exists
  const prayerNote = await PrayerNote.findById(noteId);
  if (!prayerNote) {
    return next(new AppError('Prayer note not found', 404));
  }

  // Check if user has already liked this note
  const existingInteraction = await UserInteraction.findOne({
    userId: req.user.id,
    entityType: 'PrayerNote',
    entityId: noteId,
    action: 'like',
  });

  if (existingInteraction) {
    return next(new AppError('You have already liked this prayer note', 400));
  }

  // Increment likes count
  const updatedNote = await PrayerNote.findByIdAndUpdate(
    noteId,
    { $inc: { likes: 1 } },
    { new: true, runValidators: true }
  ).populate('userId', 'username profilePicture')
   .populate('lightId', 'title');

  // Log user interaction
  await UserInteraction.create({
    userId: req.user.id,
    entityType: 'PrayerNote',
    entityId: noteId,
    action: 'like',
  });

  res.status(200).json({
    status: 'success',
    data: {
      prayerNote: updatedNote,
    },
  });
});

const getPrayerNotes = catchAsync(async (req, res, next) => {
  const { lightId, page = 1, limit = 10 } = req.query;

  // Build query object
  const query = { isPublic: true };
  if (lightId) {
    query.lightId = lightId;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch prayer notes
  const prayerNotes = await PrayerNote.find(query)
    .populate('userId', 'username profilePicture')
    .populate('lightId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await PrayerNote.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: prayerNotes.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      prayerNotes,
    },
  });
});

const getUserPrayerNotes = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch user's prayer notes
  const prayerNotes = await PrayerNote.find({ userId: req.user.id })
    .populate('lightId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await PrayerNote.countDocuments({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: prayerNotes.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      prayerNotes,
    },
  });
});

module.exports = {
  createPrayerNote,
  likePrayerNote,
  getPrayerNotes,
  getUserPrayerNotes,
};
