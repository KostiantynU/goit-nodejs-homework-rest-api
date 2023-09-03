const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const { HttpError } = require('../helpers');

const { SECRET_WORD } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }

  if (!token) {
    throw HttpError(401, 'Not authorized');
  }

  try {
    const payload = jwt.verify(token, SECRET_WORD);

    if (payload.token !== 'access') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(payload.id);

    req.user = user;
    // const { id } = jwt.verify(token, SECRET_WORD);

    // const user = await User.findById(id);

    // if (!user || !user.token || user.token !== token) {
    //   next(HttpError(401, 'Not authorized'));
    // }

    // req.user = user;
    // next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw HttpError(401, 'Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw HttpError(401, 'Invalid token');
    }

    next(HttpError(401));
  }

  next();
};

module.exports = authenticate;
