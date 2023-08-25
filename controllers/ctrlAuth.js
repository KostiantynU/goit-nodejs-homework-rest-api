const { User } = require('../models/users');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const { SECRET_WORD } = process.env;

const bcrypt = require('bcrypt');

const { HttpError, ctrlWrapper } = require('../helpers');
const { error } = require('console');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarUrl });

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
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

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;

  const filename = `${req.user._id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  // await fs.rename(tempUpload, resultUpload);
  Jimp.read(tempUpload, (err, tempUpload) => {
    if (err) throw err;
    tempUpload.resize(250, 250).write(resultUpload);
  });

  const avatarUrl = path.join('avatars', filename);
  const userWithAvatar = await User.findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true });

  res.status(200).json({ avatarUrl });
};
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
