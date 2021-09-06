const joi = require('@hapi/joi');

const userIdScheme = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userScheme = {
  name: joi.string().max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  /* isAdmin: joi.boolean() */
}

const createUserScheme = {
  ...userScheme,
  isAdmin: joi.boolean()
}

const createProviderUserScheme = {
  ...userScheme,
  apiKeyToken: joi.string().required()
}

module.exports = {
  userIdScheme,
  createUserScheme,
  createProviderUserScheme
}