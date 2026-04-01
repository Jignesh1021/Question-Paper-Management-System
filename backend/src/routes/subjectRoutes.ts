import express from 'express';
import {
  getSubjects,
  createSubject,
} from '../controllers/subjectController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getSubjects)
  .post(protect, adminOnly, createSubject);

export default router;
