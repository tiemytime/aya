const PrayerNote = require('../models/PrayerNote');
const Light = require('../models/Light');
const UserInteraction = require('../models/UserInteraction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createPrayerNote = catchAsync(async (req, res, next) => {
  const { content, lightId, isPublic } = req.body;

  // Verify that the light exists - lightId is required for prayer notes
  if (!lightId) {
    return next(new AppError('Light ID is required to create a prayer note', 400));
  }

  const light = await Light.findById(lightId);
  if (!light) {
    return next(new AppError('Light not found', 404));
  }

  // Create the prayer note
  const prayerNote = await PrayerNote.create({
    content,
    lightId,
    userId: req.user.id,
    isPublic: isPublic !== undefined ? isPublic : true,
  });

  // Update the associated Light with the prayer note reference if not already set
  if (!light.prayerNoteId) {
    await Light.findByIdAndUpdate(lightId, { prayerNoteId: prayerNote._id });
  }

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
    .populate('lightId', 'title location');

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

const searchPrayerNotes = catchAsync(async (req, res, next) => {
  const { q: query, page = 1, limit = 10 } = req.query;

  if (!query || query.trim().length === 0) {
    return next(new AppError('Search query is required', 400));
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Create search aggregation pipeline
  const searchPipeline = [
    // Match only public prayer notes
    {
      $match: {
        isPublic: true,
      }
    },
    // Lookup user information
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    // Lookup light information
    {
      $lookup: {
        from: 'lights',
        localField: 'lightId',
        foreignField: '_id',
        as: 'light'
      }
    },
    // Unwind the arrays from lookups
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$light',
        preserveNullAndEmptyArrays: true
      }
    },
    // Match documents that contain the search query in content, light title, or username
    {
      $match: {
        $or: [
          { content: { $regex: query, $options: 'i' } },
          { 'light.title': { $regex: query, $options: 'i' } },
          { 'user.username': { $regex: query, $options: 'i' } }
        ]
      }
    },
    // Sort by creation date (newest first)
    {
      $sort: { createdAt: -1 }
    },
    // Add pagination
    {
      $facet: {
        prayerNotes: [
          { $skip: skip },
          { $limit: parseInt(limit) }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    }
  ];

  const result = await PrayerNote.aggregate(searchPipeline);
  const prayerNotes = result[0].prayerNotes || [];
  const total = result[0].totalCount[0]?.count || 0;

  // Format the response to match existing API structure
  const formattedNotes = prayerNotes.map(note => ({
    _id: note._id,
    content: note.content,
    likes: note.likes,
    isPublic: note.isPublic,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    userId: note.user ? {
      _id: note.user._id,
      username: note.user.username,
      profilePicture: note.user.profilePicture
    } : null,
    lightId: note.light ? {
      _id: note.light._id,
      title: note.light.title,
      location: note.light.location
    } : null
  }));

  res.status(200).json({
    status: 'success',
    results: formattedNotes.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: {
      prayerNotes: formattedNotes,
      query: query.trim()
    },
  });
});

module.exports = {
  createPrayerNote,
  likePrayerNote,
  getPrayerNotes,
  getUserPrayerNotes,
  searchPrayerNotes,
};
