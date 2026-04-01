import express from 'express';
import { getUsers, registerUserByAdmin, updateUser } from '../controllers/userController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getUsers);

router.post('/register-by-admin', protect, adminOnly, registerUserByAdmin);
router.put('/:id', protect, adminOnly, updateUser);

export default router;
