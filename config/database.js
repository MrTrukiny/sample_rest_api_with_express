import mongoose from 'mongoose';
import ENV, { nodEnv } from './index.js';

const MONGO_URI = ENV[nodEnv].database.mongoUri;

export const connectToDb = () => {
  mongoose
    .connect(MONGO_URI)
    .then((connection) =>
      console.log(
        `MongoDb Connected: ${connection.connection.host}`.cyan.underline.bold
      )
    )
    .catch((error) =>
      console.log(`MongoDB connection error: ${error}`.red.bold)
    );
};
