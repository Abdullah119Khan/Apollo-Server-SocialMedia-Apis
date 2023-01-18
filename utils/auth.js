const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/default')

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if(authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if(token) {
      try {
        const user = jwt.verify(token, SECRET_KEY)
        return user;
      } catch(err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    } else {
      throw new AuthenticationError('Authenticatio header must be start with \'Bearer token')
    }
  } else {
    throw new AuthenticationError('Authorization header must be provided')
  }
}