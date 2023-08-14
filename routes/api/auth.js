const express = require('express');
const { validateBody } = require('../../middlewares');
const { authSchemas } = require('../../models/users');
const ctrlAuth = require('../../controllers/auth');

const authRouter = express.Router();

authRouter.post('/register', validateBody(authSchemas.registerSchema), ctrlAuth.register);

authRouter.post('/login', validateBody(authSchemas.loginSchema), ctrlAuth.login);

module.exports = authRouter;
