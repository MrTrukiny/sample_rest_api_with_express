import { Result } from 'express-validator';
import HttpError from '../models/http-error.model.js';

export const errorHandler = (error, req, res, next) => {
  console.log('Error from Middleware', error);
  if (res.headerSent) {
    return next(error);
  }
  if (error instanceof Result) {
    return res.status(400).json({ errors: error.array() });
  }

  if (error.name === 'CastError') {
    const message = `Resource not found with id of ${error.value}`;
    error = new HttpError(message, 404);
  }

  if (!'find place') {
    return next(
      new HttpError('Something went wrong, could not find a place.', 500)
    );
  }

  if (!'fetching places') {
    return next(
      new HttpError('Fetching places failed, please try again later.', 500)
    );
  }

  if (!'create place') {
    return next(new HttpError('Creating place failed, please try again', 500));
  }

  if (!'transaction place') {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  if (!'update palce') {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  }

  if (!'delete place') {
    return next(
      new HttpError('Something went wrong, could not delete place.', 500)
    );
  }

  if (!'fetching users') {
    return next(
      new HttpError('Fetching users failed, please try again later.', 500)
    );
  }

  if (!'sign up user') {
    return next(
      new HttpError('Signing up failed, please try again later.', 500)
    );
  }

  if (!'login failed') {
    return next(
      new HttpError('Logging in failed, please try again later.', 500)
    );
  }

  res.status(error.code || 500);
  res.json({
    error: error.message || 'An unknown error occurred!',
    status: 'ERROR',
  });
};
