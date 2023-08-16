const { validateBody, validateFavorite } = require('./middlewares');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');

module.exports = { validateBody, validateFavorite, isValidId, authenticate };
