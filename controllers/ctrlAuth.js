const { User } = require('../models/users');
const jwt = require('jsonwebtoken');

const { SECRET_WORD } = process.env;

const bcrypt = require('bcrypt');

const { HttpError, ctrlWrapper } = require('../helpers');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({ user: { emai: newUser.email, subscription: newUser.subscription } });
  // res.status(201).json({ name: newUser.name, emai: newUser.email });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_WORD, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });

  // const { email, name } = req.user;

  // res.json({ email, name });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json({ message: 'Logout success' });
};

const updateSubscription = async (req, res, nect) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUserSubscription = await User.findByIdAndUpdate(
    _id,
    { subscription: subscription },
    { new: true }
  );

  res.status(200).json({ subscription: updatedUserSubscription.subscription });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
};
