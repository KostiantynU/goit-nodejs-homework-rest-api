const express = require('express');

const ctrlAuth = require('../../controllers/auth');

const { validateBody, authenticate } = require('../../middlewares');
const { authSchemas } = require('../../models/users');

const authRouter = express.Router();

authRouter.post('/register', validateBody(authSchemas.registerSchema), ctrlAuth.register);

authRouter.post('/login', validateBody(authSchemas.loginSchema), ctrlAuth.login);

authRouter.get('/current', authenticate, ctrlAuth.getCurrent);

authRouter.post('/logout', authenticate, ctrlAuth.logout);

module.exports = authRouter;
