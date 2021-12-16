import axios from 'axios';

import HttpError from '../models/http-error.model.js';
import ENV, { nodEnv } from '../config/index.js';

const API_KEY = ENV[nodEnv].geocoding.apiKey;
const GEOCODING_API_URL =
  'https://maps.googleapis.com/maps/api/geocode/json?address=';

export const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `${GEOCODING_API_URL}${encodeURIComponent(address)}&key=${API_KEY}`
  );

  const { data } = response;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location fot the specified address.',
      404
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};
