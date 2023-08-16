const express = require('express');

const { ctrlAuth } = require('../../controllers');

const { validateBody, authenticate, validateSubscription } = require('../../middlewares');
const { authSchemas } = require('../../models/users');

const authRouter = express.Router();

authRouter.post('/register', validateBody(authSchemas.registerSchema), ctrlAuth.register);

authRouter.post('/login', validateBody(authSchemas.loginSchema), ctrlAuth.login);

authRouter.get('/current', authenticate, ctrlAuth.getCurrent);

authRouter.post('/logout', authenticate, ctrlAuth.logout);

authRouter.patch(
  '/',
  authenticate,
  validateSubscription(authSchemas.subscriptionSchema),
  ctrlAuth.updateSubscription
);

module.exports = authRouter;
