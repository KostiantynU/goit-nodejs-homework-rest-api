const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { tokens } = require('../config/app').jwt;
const Token = require('../models/token');
const { SECRET_WORD } = process.env;

const generateAccessToken = userID => {
  const payload = { userID, type: tokens.access.type };

  const options = { expiresIn: tokens.access.expiresIn };

  return jwt.sign(payload, SECRET_WORD, options);
};
const generateRefreshToken = () => {
  const payload = { id: nanoid(), type: tokens.refresh.type };

  const options = { expiresIn: tokens.refresh.expiresIn };

  return {
    id: payload.id,
    token: jwt.sign(payload, SECRET_WORD, options),
  };
};
const replaceDBRefreshToken = async (tokenID, userID) => {
  await Token.findByIdAndDelete(userID);

  const result = await Token.create({ tokenID, userID });
};

const updateTokens = async userID => {
  const accessToken = checkRefreshToken.generateAccessToken(userID);
  const refreshToken = checkRefreshToken.generateRefreshToken();

  await checkRefreshToken.replaceDBRefreshToken(refreshToken.id, userID);

  return { accessToken, refreshToken: refreshToken.token };
};

const checkRefreshToken = {
  generateAccessToken,
  generateRefreshToken,
  replaceDBRefreshToken,
  updateTokens,
};

module.exports = checkRefreshToken;
