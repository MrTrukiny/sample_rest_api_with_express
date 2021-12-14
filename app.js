import express from 'express';
import { Result } from 'express-validator';

// Routes
import placesRoutes from './routes/places.routes.js';
import usersRoutes from './routes/users.routes.js';

// Utils
import HttpError from './models/http-error.model.js';

const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`));
