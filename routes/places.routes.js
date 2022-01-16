import { Router } from 'express';
import { body } from 'express-validator';

// Controllers
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from '../controllers/places.controller.js';

const router = Router();

router.post(
  '/',
  body('title', 'Title is required!').notEmpty(),
  body('description', 'Description must be between 5 and 200 chars.').isLength({ min: 5, max: 200 }),
  body('address').notEmpty(),
  createPlace
);

router
  .route('/:placeId')
  .get(getPlaceById)
  .patch(
    body('title').notEmpty(),
    body('description').isLength({ min: 5, max: 200 }),
    updatePlace
  )
  .delete(deletePlace);

router.get('/user/:userId', getPlacesByUserId);

export default router;
