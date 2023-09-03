const express = require('express');

const { ctrlAuth } = require('../../controllers');
const { refreshToken } = require('../../controllers');

const { validateBody, authenticate, validateSubscription, upload } = require('../../middlewares');
const { authSchemas } = require('../../models/users');

const authRouter = express.Router();

authRouter.post('/register', validateBody(authSchemas.registerSchema), ctrlAuth.register);

authRouter.post('/login', validateBody(authSchemas.loginSchema), ctrlAuth.login);

authRouter.post('/refresh', refreshToken);

authRouter.get('/current', authenticate, ctrlAuth.getCurrent);

authRouter.post('/logout', authenticate, ctrlAuth.logout);

authRouter.patch(
  '/',
  authenticate,
  validateSubscription(authSchemas.subscriptionSchema),
  ctrlAuth.updateSubscription
);

authRouter.get('/verify/:verificationToken', ctrlAuth.verifyUser);

// authRouter.post('/verify', validateBody(authSchemas.verifySchema), ctrlAuth.resendEmail);
authRouter.post('/verify', ctrlAuth.resendEmail);

authRouter.patch('/avatars', authenticate, upload.single('avatar'), ctrlAuth.updateAvatar);

module.exports = authRouter;
