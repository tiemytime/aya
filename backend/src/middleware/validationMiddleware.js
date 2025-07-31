const AppError = require('../utils/AppError');

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

module.exports = validationMiddleware;
