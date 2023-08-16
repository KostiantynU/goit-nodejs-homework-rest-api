const { HttpError } = require('../helpers');

const validateBody = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, 'Помилка від Joi або іншої бібліотеки валідації'));
    }
    //'Помилка від Joi або іншої бібліотеки валідації'
    next();
  };

  return func;
};

const validateFavorite = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, 'Missing field favorite'));
    }

    next();
  };

  return func;
};

const validateSubscription = schema => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, 'Wrong value'));
    }

    next();
  };

  return func;
};

module.exports = { validateBody, validateFavorite, validateSubscription };
