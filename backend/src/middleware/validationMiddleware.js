const AppError = require('../utils/AppError');
const { z } = require('zod');

// Schema for creating a light
const createLightSchema = z.object({
  location: z.string()
    .min(1, 'Location is required')
    .max(200, 'Location must be at most 200 characters long')
    .trim(),
  title: z.string()
    .max(100, 'Title must be at most 100 characters long')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be at most 1000 characters long')
    .trim()
    .optional(),
  category: z.string()
    .length(24, 'Category must be a valid ObjectId')
    .optional(),
  isAnonymous: z.boolean()
    .optional(),
});

// Schema for creating a light with prayer note
const createLightWithPrayerSchema = z.object({
  location: z.string()
    .min(1, 'Location is required')
    .max(200, 'Location must be at most 200 characters long')
    .trim(),
  title: z.string()
    .max(100, 'Title must be at most 100 characters long')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be at most 1000 characters long')
    .trim()
    .optional(),
  category: z.string()
    .length(24, 'Category must be a valid ObjectId')
    .optional(),
  isAnonymous: z.boolean()
    .optional(),
  eventId: z.string()
    .length(24, 'Event ID must be a valid ObjectId')
    .optional(),
  prayerContent: z.string()
    .min(5, 'Prayer content must be at least 5 characters long')
    .max(500, 'Prayer content must be at most 500 characters long')
    .trim(),
  prayerIsPublic: z.boolean()
    .optional(),
});

const validationMiddleware = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      // Validate the specified property of the request
      const validatedData = schema.parse(req[property]);
      
      // Replace the request property with validated data
      req[property] = validatedData;
      
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error.errors) {
        const errorMessages = error.errors.map(err => {
          return `${err.path.join('.')}: ${err.message}`;
        }).join(', ');
        
        return next(new AppError(`Validation failed: ${errorMessages}`, 400));
      }
      
      // Handle other errors
      return next(new AppError('Validation failed', 400));
    }
  };
};

// Specific validation middleware for creating lights
const validateCreateLight = validationMiddleware(createLightSchema);
// Specific validation middleware for creating lights with prayer notes
const validateCreateLightWithPrayer = validationMiddleware(createLightWithPrayerSchema);

module.exports = validationMiddleware;
module.exports.validationMiddleware = validationMiddleware;
module.exports.validateCreateLight = validateCreateLight;
module.exports.validateCreateLightWithPrayer = validateCreateLightWithPrayer;
