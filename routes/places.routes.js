import { Router } from 'express';

// Controllers
import {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
} from '../controllers/places.controller.js';

const router = Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlaceByUserId);

router.post('/', createPlace);

export default router;
