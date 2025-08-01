const Light = require('../models/Light');
const Event = require('../models/Event');
const PrayerNote = require('../models/PrayerNote');
const UserInteraction = require('../models/UserInteraction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * Create a new Light
 * @desc Creates a new light with user's location
 * @route POST /api/lights
 * @access Private (requires authentication)
 */
exports.createLight = catchAsync(async (req, res, next) => {
  const { location, title, description, category, isAnonymous, eventId, prayerNoteId } = req.body;

  // Validate required fields
  if (!location) {
    return next(new AppError('Location is required to create a light', 400));
  }

  // Validate eventId if provided
  if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }
  }

  // Validate prayerNoteId if provided
  if (prayerNoteId) {
    const prayerNote = await PrayerNote.findById(prayerNoteId);
    if (!prayerNote) {
      return next(new AppError('Prayer note not found', 404));
    }
  }

  // Create new light with user ID from auth middleware
  const newLight = await Light.create({
    location,
    createdBy: req.user._id, // User ID from auth middleware
    title,
    description,
    category,
    isAnonymous: isAnonymous || false,
    eventId,
    prayerNoteId,
    timestamp: new Date(), // Explicitly set timestamp (though it has a default)
  });

  // Populate user information and references for response
  await newLight.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'eventId', select: 'title description eventType' },
    { path: 'prayerNoteId', select: 'content' }
  ]);

  res.status(201).json({
    success: true,
    data: {
      light: newLight,
      lightId: newLight._id,
    },
    message: 'Light created successfully',
  });
});

/**
 * Get all lights
 * @desc Retrieve all lights with pagination
 * @route GET /api/lights
 * @access Public
 */
exports.getLights = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  
  // Filter by location if provided
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }

  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Get total count for pagination
  const total = await Light.countDocuments(query);

  // Fetch lights with pagination and population
  const lights = await Light.find(query)
    .populate('createdBy', 'name email')
    .populate('category', 'name description')
    .populate('eventId', 'title description eventType')
    .populate('prayerNoteId', 'content')
    .sort({ timestamp: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      lights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * Get a single light by ID
 * @desc Retrieve a specific light
 * @route GET /api/lights/:id
 * @access Public
 */
exports.getLight = catchAsync(async (req, res, next) => {
  const light = await Light.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('category', 'name description')
    .populate('eventId', 'title description eventType')
    .populate('prayerNoteId', 'content');

  if (!light) {
    return next(new AppError('Light not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      light,
    },
  });
});

/**
 * Update a light
 * @desc Update a light (only by creator)
 * @route PUT /api/lights/:id
 * @access Private (requires authentication)
 */
exports.updateLight = catchAsync(async (req, res, next) => {
  const light = await Light.findById(req.params.id);

  if (!light) {
    return next(new AppError('Light not found', 404));
  }

  // Check if user is the creator of the light
  if (light.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own lights', 403));
  }

  const updatedLight = await Light.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('createdBy', 'name email')
   .populate('category', 'name description');

  res.status(200).json({
    success: true,
    data: {
      light: updatedLight,
    },
    message: 'Light updated successfully',
  });
});

/**
 * Delete a light
 * @desc Delete a light (only by creator)
 * @route DELETE /api/lights/:id
 * @access Private (requires authentication)
 */
exports.deleteLight = catchAsync(async (req, res, next) => {
  const light = await Light.findById(req.params.id);

  if (!light) {
    return next(new AppError('Light not found', 404));
  }

  // Check if user is the creator of the light
  if (light.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only delete your own lights', 403));
  }

  await Light.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
    message: 'Light deleted successfully',
  });
});

/**
 * Get user's lights
 * @desc Get all lights created by the authenticated user
 * @route GET /api/lights/my-lights
 * @access Private (requires authentication)
 */
exports.getMyLights = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { createdBy: req.user._id };

  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  const total = await Light.countDocuments(query);

  const lights = await Light.find(query)
    .populate('category', 'name description')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      lights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * Create a Light and PrayerNote together
 * @desc Creates a new light and an associated prayer note in a single transaction
 * @route POST /api/lights/with-prayer
 * @access Private (requires authentication)
 */
exports.createLightWithPrayer = catchAsync(async (req, res, next) => {
  const { 
    location, 
    title, 
    description, 
    category, 
    isAnonymous, 
    eventId,
    prayerContent,
    prayerIsPublic 
  } = req.body;

  // Validate required fields
  if (!location) {
    return next(new AppError('Location is required to create a light', 400));
  }
  
  if (!prayerContent) {
    return next(new AppError('Prayer content is required', 400));
  }

  // Validate eventId if provided
  if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }
  }

  // Start a MongoDB session for transaction
  const session = await Light.startSession();
  
  try {
    session.startTransaction();

    // Create the Light first
    const newLight = await Light.create([{
      location,
      createdBy: req.user._id,
      title,
      description,
      category,
      isAnonymous: isAnonymous || false,
      eventId,
      timestamp: new Date(),
    }], { session });

    // Create the PrayerNote with reference to the Light
    const newPrayerNote = await PrayerNote.create([{
      content: prayerContent,
      lightId: newLight[0]._id,
      userId: req.user._id,
      isPublic: prayerIsPublic !== undefined ? prayerIsPublic : true,
    }], { session });

    // Update the Light with reference to the PrayerNote
    await Light.findByIdAndUpdate(
      newLight[0]._id,
      { prayerNoteId: newPrayerNote[0]._id },
      { session }
    );

    // Log user interactions
    await UserInteraction.create([
      {
        userId: req.user._id,
        entityType: 'Light',
        entityId: newLight[0]._id,
        action: 'create',
      },
      {
        userId: req.user._id,
        entityType: 'PrayerNote',
        entityId: newPrayerNote[0]._id,
        action: 'create',
      }
    ], { session });

    // Commit the transaction
    await session.commitTransaction();

    // Populate the created documents for response
    const populatedLight = await Light.findById(newLight[0]._id)
      .populate([
        { path: 'createdBy', select: 'name email username' },
        { path: 'eventId', select: 'title description eventType' },
        { path: 'prayerNoteId', select: 'content isPublic' }
      ]);

    const populatedPrayerNote = await PrayerNote.findById(newPrayerNote[0]._id)
      .populate([
        { path: 'userId', select: 'name email username' },
        { path: 'lightId', select: 'title location' }
      ]);

    res.status(201).json({
      success: true,
      data: {
        light: populatedLight,
        prayerNote: populatedPrayerNote,
        lightId: newLight[0]._id,
        prayerNoteId: newPrayerNote[0]._id,
      },
      message: 'Light and prayer note created successfully',
    });

  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    return next(error);
  } finally {
    await session.endSession();
  }
});
