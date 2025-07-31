const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { signToken } = require('../config/config');

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new AppError('User with this email already exists', 400));
    }
    if (existingUser.username === username) {
      return next(new AppError('Username already taken', 400));
    }
  }

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password,
  });

  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  createSendToken(user, 200, res);
});

const getProfile = catchAsync(async (req, res, next) => {
  // req.user is available from protect middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  // Don't allow password updates through this route
  if (req.body.password) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    );
  }

  // Filter out unwanted field names that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['username', 'email', 'profilePicture', 'bio', 'location'];
  
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  // Check if username or email is being updated and if they already exist
  if (filteredBody.username || filteredBody.email) {
    const query = {};
    if (filteredBody.username) query.username = filteredBody.username;
    if (filteredBody.email) query.email = filteredBody.email;
    
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        { $or: [query] }
      ]
    });

    if (existingUser) {
      if (existingUser.username === filteredBody.username) {
        return next(new AppError('Username already taken', 400));
      }
      if (existingUser.email === filteredBody.email) {
        return next(new AppError('Email already in use', 400));
      }
    }
  }

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
