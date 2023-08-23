const { validateBody, validateFavorite, validateSubscription } = require('./middlewares');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./upload');

module.exports = {
  validateBody,
  validateFavorite,
  isValidId,
  authenticate,
  validateSubscription,
  upload,
};
