import { Router } from 'express';

import { body } from 'express-validator';

// Controllers
import {
  getUsers,
  signupUser,
  loginUser,
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', getUsers);
router.post(
  '/signup',
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(), // Test@TesT.coM
  body('password').isLength({ min: 6, max: 12 }),
  signupUser
);
router.post('/login', loginUser);

export default router;
