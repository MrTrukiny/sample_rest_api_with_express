// import { v4 as uuid } from 'uuid';
import { validationResult } from 'express-validator';

// Models
import User from '../models/User.schema.js';

// Utils
import HttpError from '../models/http-error.model.js';

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Eduardo Hernández',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    // users = await User.find({}, '-password');
    users = await User.find().select('-password');
  } catch (error) {
    return next(
      new HttpError('Fetching users failed, please try again later.', 500)
    );
  }

  res.json({ users });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

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
    places,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

  res.status(201).json({ user: newUser });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError('Logging in failed, please try again later.', 500)
    );
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  res.json({ message: 'Logged in!' });
};

export { getUsers, signupUser, loginUser };
