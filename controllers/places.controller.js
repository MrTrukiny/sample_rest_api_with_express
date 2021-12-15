// import uuid from 'uuid/v4';
import { v4 as uuid } from 'uuid';
import { validationResult } from 'express-validator';

// Models
import Place from '../models/Place.schema.js';

// Utils
import HttpError from '../models/http-error.model.js';
import { getCoordsForAddress } from '../utils/location.js';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

const getPlaceById = async (req, res, next) => {
  const { placeId } = req.params; // { pid: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
    // place = await Place.findById(placeId).select('-__v');
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find a place.', 500)
    );
  }

  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided id.', 404)
    );
  }

  console.log('Place', place);
  console.log('Object Plain', place.toObject());
  console.log(
    'Object Options',
    place.toObject({ getters: true, versionKey: false })
  );
  console.log('JSON', JSON.stringify(place));

  res.json({ place }); // => { place } => { place: place }
};

const getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(
      new HttpError('Fetching places failed, please try again later.', 500)
    );
  }

  if (!places || !places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  // places = places.map((place) => place.toObject({ versionKey: false }));

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // const title = req.body.title;
  const { title, description, address, creator } = req.body;

  let coordinates;
  // Then / catch
  /* getCoordsForAddress(address)
    .then((response) => (coordinates = response))
    .catch((error) => next(error)); */

  // Async / await
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: 'imageUrl',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    return next(HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
    // return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const { placeId } = req.params;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  }

  if (!place) {
    return next(new HttpError('There is not a place with this id.'));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  }

  /* try {
    // place = await Place.updateOne({ _id: placeId }, { title, description });
    place = await Place.findOneAndUpdate(
      { _id: placeId },
      { title, description }
    );
    place = await Place.findOneAndUpdate(
      { _id: placeId },
      { title, description },
      { new: true }
    );
    place = await Place.findByIdAndUpdate(
      placeId,
      { title, description },
      { new: true }
    );
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  } */

  res.status(200).json({ place });
};

const deletePlace = (req, res, next) => {
  const { placeId } = req.params;

  try {
    await Place.findByIdAndDelete(placeId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place.'));
  }
  res.status(200).json({ message: 'Deleted place.' });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
