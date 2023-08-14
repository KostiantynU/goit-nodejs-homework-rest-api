const { validateBody, validateFavorite } = require('./middlewares');
const isValidId = require('./isValidId');

module.exports = { validateBody, validateFavorite, isValidId };
