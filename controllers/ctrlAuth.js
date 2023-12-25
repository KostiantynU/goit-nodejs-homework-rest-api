const { User } = require('../models/users');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
// const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { SECRET_WORD } = process.env;

const bcrypt = require('bcrypt');

const { HttpError, ctrlWrapper, nodemailerTransport, checkRefreshToken } = require('../helpers');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, text) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
    verificationToken,
  });

  const verificationEmail = {
    to: email,
    subject: `Verify your e-mail`,
    html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${verificationToken}'>Click to verify your e-mail!</a>`,
  };

  const resultSend = await nodemailerTransport.sendMail({
    ...verificationEmail,
    from: 'engineerkonstantin@gmail.com',
  });

  res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
  // res.status(201).json({ name: newUser.name, emai: newUser.email });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email is not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  // const payload = { id: user._id };
  // const token = jwt.sign(payload, SECRET_WORD, { expiresIn: '1h' });
  // await User.findByIdAndUpdate(user._id, { token });

  const tokens = await checkRefreshToken.updateTokens(user._id);

  res.status(200).json({ tokens, user: { email: user.email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });

  // const { email, name } = req.user;

  // res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).json({ message: 'Logout success' });
};

const updateSubscription = async (req, res) => {
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

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;

  const verificatedUser = await User.findOne({ verificationToken });

  if (!verificatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = await User.findByIdAndUpdate(
    verificatedUser._id,
    { verify: true, verificationToken: '' },
    { new: true }
  );

  res.status(200).json({ message: 'Verification successful' });
};

const resendEmail = async (req, res) => {
  if (!req.body.email) {
    throw HttpError(400, 'Missing required field email');
  }

  const resendEmailUser = await User.findOne({ email: req.body.email });

  if (!resendEmailUser) {
    throw HttpError(400, 'Bad request - maybe you have mistake in email ;-)');
  }

  if (resendEmailUser.verify) {
    throw HttpError(401, 'Verification has already been passed');
  }

  const verificationEmail = {
    to: resendEmailUser.email,
    subject: `Verify your e-mail`,
    html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${resendEmailUser.verificationToken}'>Click to verify your e-mail!</a>`,
  };

  const resultSend = await nodemailerTransport.sendMail({
    ...verificationEmail,
    from: 'engineerkonstantin@gmail.com',
  });

  res.status(200).json({ message: 'Verification email sent' });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyUser: ctrlWrapper(verifyUser),
  resendEmail: ctrlWrapper(resendEmail),
};
