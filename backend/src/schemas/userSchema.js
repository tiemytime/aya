const { z } = require('zod');

// Password validation regex: at least one uppercase, one lowercase, one number, one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

const registerUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .trim(),
  email: z.string()
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

const loginUserSchema = z.object({
  email: z.string()
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long'),
});

const updateProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at most 30 characters long')
    .trim()
    .optional(),
  email: z.string()
    .email('Please provide a valid email address')
    .trim()
    .toLowerCase()
    .optional(),
  profilePicture: z.string()
    .url('Please provide a valid URL for profile picture')
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be at most 500 characters long')
    .trim()
    .optional(),
  location: z.string()
    .max(100, 'Location must be at most 100 characters long')
    .trim()
    .optional(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateProfileSchema,
};
