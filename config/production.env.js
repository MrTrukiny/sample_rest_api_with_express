export const production = {
  database: {
    mongoUri: process.env.MONGO_URI_PROD,
  },
  geocoding: {
    apiKey: process.env.GEOCODING_API_KEY_PROD,
  },
};
