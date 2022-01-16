import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Models
import Place from '../models/Place.schema.js';
import User from '../models/User.schema.js';

// Utils
import HttpError from '../models/http-error.model.js';
import { getCoordsForAddress } from '../utils/location.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

const getPlaceById = asyncHandler(async (req, res, next) => {
  const { placeId } = req.params;

  const place = await Place.findById(placeId).select('-__v');

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    );
  }

  res.status(200).json({ data: { place }, status: 'OK' });
});

const getPlacesByUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const userWithPlaces = await User.findById(userId).populate({
    path: 'places',
    select: { __v: 0 },
  });
  if (!userWithPlaces || !userWithPlaces.places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  const { places } = userWithPlaces;

  res.status(200).json({ data: { places }, status: 'OK' });
});

const createPlace = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, address, creator } = req.body;

  const coordinates = await getCoordsForAddress(address);

  const newPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  });

  const user = await User.findById(creator);

  if (!user) {
    return next(new HttpError('Could not find user for provided id', 404));
  }

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await newPlace.save({ session });
    await user.places.push(newPlace);
    await user.save({ session });
  });
  await session.endSession();

  res.status(201).json({ data: { place: newPlace }, status: 'OK' });
});

const updatePlace = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }

  const { title, description } = req.body;
  const { placeId } = req.params;

  const place = await Place.findByIdAndUpdate(
    placeId,
    { title, description },
    { new: true }
  ).select('-__v');

  res.status(200).json({ data: { place }, status: 'OK' });
});

const deletePlace = asyncHandler(async (req, res, next) => {
  const { placeId } = req.params;

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const place = await Place.findByIdAndDelete(placeId, {
      session,
    }).populate('creator');
    place.creator.places.pull(place);
    await place.creator.save({ session });
  });
  session.endSession();

  res.status(200).json({ message: 'Deleted place.', status: 'OK' });
});

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
