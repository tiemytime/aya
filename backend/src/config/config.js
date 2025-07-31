const jwt = require('jsonwebtoken');

const jwtConfig = {
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: '7d',
};

const signToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  jwtConfig,
  signToken,
  verifyToken,
};
