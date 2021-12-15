// import dotenv from 'dotenv';
import express from 'express';
import { Result } from 'express-validator';
import mongoose from 'mongoose';
import 'colors';

// Routes
import placesRoutes from './routes/places.routes.js';
import usersRoutes from './routes/users.routes.js';

// Utils
import HttpError from './models/http-error.model.js';
import ENV, { port, nodEnv } from './config/index.js';

// Call dotenv for load ENV variables from .env
// dotenv.config();

const app = express();

const MONGO_URI = ENV[nodEnv].database.mongoUri;
const PORT = port;

app.use(express.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  if (error instanceof Result) {
    return res.status(400).json({ errors: error.array() });
  }
  res.status(error.code || 500);
  res.json({ error: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(MONGO_URI)
  .then((connection) =>
    console.log(
      `MongoDb Connected: ${connection.connection.host}`.cyan.underline.bold
    )
  )
  .catch((error) => console.log(`MongoDB connection error: ${error}`.red.bold));

app.listen(
  PORT,
  console.log(`Server running in ${nodEnv} mode on port ${PORT}`.yellow.bold)
);
