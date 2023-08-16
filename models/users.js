const { Schema, model } = require('mongoose');
const Joi = require('joi');

// const emailRegExp = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
const emailRegExp = new RegExp('[A-Za-z0-9]+@[a-z]+.[a-z]{2,3}');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: emailRegExp, required: true, unique: true },
    password: { type: String, minlength: 6, required: true },
    token: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
});

const authSchemas = { registerSchema, loginSchema };

const User = model('user', userSchema);

module.exports = { authSchemas, User };
