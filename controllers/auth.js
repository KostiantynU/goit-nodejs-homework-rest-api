const { User } = require('../models/users');
const jwt = require('jsonwebtoken');

const { secret_word } = process.env;

const bcrypt = require('bcrypt');

const { HttpError, ctrlWrapper } = require('../helpers');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({ name: newUser.name, emai: newUser.email });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret_word, { expiresIn: '1' });

  res.json({ token });
};

module.exports = { register: ctrlWrapper(register), login: ctrlWrapper(login) };
