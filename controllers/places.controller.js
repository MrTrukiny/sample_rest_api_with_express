// import uuid from 'uuid/v4';
import { v4 as uuid } from 'uuid';
import { validationResult } from 'express-validator';

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

const getPlaceById = (req, res, next) => {
  const { placeId } = req.params; // { pid: 'p1' }

  const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place }); // => { place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
  const { userId } = req.params;

  const places = DUMMY_PLACES.filter((place) => {
    return place.creator === userId;
  });

  if (!places || !places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // const title = req.body.title;
  const { title, description, address, creator } = req.body;

  let coordinates;
  getCoordsForAddress(address)
    .then((response) => (coordinates = response))
    .catch((error) => next(error));

  // Async / await
  /* try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  } */

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); // unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
    // return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;
  const { placeId } = req.params;

  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  const updatedPlace = { ...DUMMY_PLACES[placeIndex] };

  if (!updatedPlace) {
    return next(new HttpError('There is not a place with this id.'));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const { placeId } = req.params;
  if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
