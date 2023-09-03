const { Schema, model, Types } = require('mongoose');

const tokenSchema = new Schema(
  {
    tokenID: { type: String },
    userID: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const Token = model('token', tokenSchema);

module.exports = Token;
