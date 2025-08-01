const { z } = require('zod');

/**
 * Zod validation middleware factory
 * Creates middleware to validate request parameters, query, and body using Zod schemas
 */
const validateRequest = (schemas) => {
  return (req, res, next) => {
    try {
      // Validate params if schema provided
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          console.error('Params validation failed:', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
            received: req.params
          });
          
          return res.status(400).json({
            success: false,
            message: 'Invalid request parameters',
            errors: result.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              received: err.received
            }))
          });
        }
        req.params = result.data;
      }

      // Validate query if schema provided
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          console.error('Query validation failed:', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
            received: req.query
          });
          
          return res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            errors: result.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              received: err.received
            }))
          });
        }
        req.query = result.data;
      }

      // Validate body if schema provided
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          console.error('Body validation failed:', {
            path: req.path,
            method: req.method,
            errors: result.error.errors,
            received: req.body
          });
          
          return res.status(400).json({
            success: false,
            message: 'Invalid request body',
            errors: result.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
              received: err.received
            }))
          });
        }
        req.body = result.data;
      }

      next();
    } catch (error) {
      console.error('Validation middleware error:', {
        path: req.path,
        method: req.method,
        error: error.message,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  };
};

module.exports = {
  validateRequest
};
