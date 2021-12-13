import { Router } from 'express';

// Controllers
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/places.controller.js';

const router = Router();

router.post('/', createPlace);

router
  .route('/:placeId')
  .get(getPlaceById)
  .patch(updatePlace)
  .delete(deletePlace);

router.get('/user/:userId', getPlacesByUserId);

export default router;
