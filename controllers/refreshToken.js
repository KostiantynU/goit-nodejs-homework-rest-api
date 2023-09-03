const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const { checkRefreshToken, HttpError } = require('../helpers');
const { SECRET_WORD } = process.env;
const { ctrlWrapper } = require('../helpers');

const refreshToken = async (req, res) => {
  const { token: refreshToken } = req.body;
  let payload;

  try {
    payload = jwt.verify(refreshToken, SECRET_WORD);

    if (payload.type !== 'refresh') {
      return res.status(400).json({ message: 'Invalid type' });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw HttpError(401, 'Token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw HttpError(401, 'Invalid token');
    }
  }

  const token = await Token.findOne({ tokenID: payload.id });

  if (token === null) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const newTokens = await checkRefreshToken.updateTokens(token.userID);

  return res.json(newTokens);
};

module.exports = { refreshToken: ctrlWrapper(refreshToken) };
