import express from 'express';
import 'colors';

// Routes
import placesRoutes from './routes/places.routes.js';
import usersRoutes from './routes/users.routes.js';

// Middlewares
import { errorHandler } from './middlewares/errorHandler.middleware.js';

// Utils
import HttpError from './models/http-error.model.js';
import { port, nodEnv } from './config/index.js';
import { connectToDb } from './config/database.js';

const app = express();
const PORT = port;
connectToDb();

app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
app.use(errorHandler);

app.listen(
  PORT,
  console.log(`Server running in ${nodEnv} mode on port ${PORT}`.yellow.bold)
);
