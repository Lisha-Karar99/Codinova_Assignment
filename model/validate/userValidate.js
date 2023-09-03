const Joi = require("joi");

// schema to validate signup
const user_schema = Joi.object({
  username: Joi.string().trim().max(40).min(1).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  type: Joi.string().valid('Admin', 'Manager').required(),
});

// schema to validate login
const user_login_schema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

module.exports = { user_schema, user_login_schema };
