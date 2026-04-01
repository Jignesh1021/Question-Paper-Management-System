import express from 'express';
import { getBatches, createBatch, addStudentToBatch } from '../controllers/batchController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getBatches)
  .post(protect, adminOnly, createBatch);

router.route('/:id/students')
  .post(protect, adminOnly, addStudentToBatch);

export default router;
