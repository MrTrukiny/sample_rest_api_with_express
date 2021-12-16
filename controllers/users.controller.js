import { validationResult } from 'express-validator';

// Models
import User from '../models/User.schema.js';

// Utils
import HttpError from '../models/http-error.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-__v');

  res.status(200).json({ data: users, status: 'OK' });
});

const signupUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new HttpError('User exists already, please login instead.', 404)
    );
  }

  const newUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
  });

  await newUser.save();

  res.status(201).json({ data: newUser, status: 'OK' });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select('+password');

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  res.status(200).json({ message: 'Logged in!', status: 'OK' });
});

export { getUsers, signupUser, loginUser };
