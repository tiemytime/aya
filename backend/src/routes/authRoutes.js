const express = require('express');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validationMiddleware');
const { registerUserSchema, loginUserSchema } = require('../schemas/userSchema');

const router = express.Router();

// Authentication routes
router.post('/register', 
  validationMiddleware(registerUserSchema, 'body'),
  authController.register
);

router.post('/login',
  validationMiddleware(loginUserSchema, 'body'),
  authController.login
);

module.exports = router;
