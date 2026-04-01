import express from 'express';
import {
  getPapers,
  getPaperById,
  generatePaper
} from '../controllers/paperController';
import { protect, teacherOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getPapers);

router.route('/generate')
  .post(protect, teacherOnly, generatePaper);

router.route('/:id')
  .get(protect, getPaperById);

export default router;
