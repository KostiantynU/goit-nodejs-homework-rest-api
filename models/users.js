const { Schema, model } = require('mongoose');
const Joi = require('joi');

// const emailRegExp = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
const emailRegExp = new RegExp('[A-Za-z0-9]+@[a-z]+.[a-z]{2,3}');

const userSchema = new Schema(
  {
    // name: { type: String, required: true },
    email: {
      type: String,
      match: emailRegExp,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, minlength: 6, required: [true, 'Set password for user'] },
    subscription: { type: String, enum: ['starter', 'pro', 'business'], default: 'starter' },
    token: { type: String, default: '' },
    avatarUrl: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  // name: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});
//.valid('starter', 'pro', 'business')

const authSchemas = { registerSchema, loginSchema, subscriptionSchema };

const User = model('user', userSchema);

module.exports = { authSchemas, User };
