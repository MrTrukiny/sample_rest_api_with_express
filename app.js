import express from 'express';

// Import routes
import placesRoutes from './routes/places.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/places', placesRoutes); // => /api/places...

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`));
