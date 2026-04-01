import express from 'express';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  updateQuestionStatus
} from '../controllers/questionController';
import { protect, teacherOnly, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getQuestions)
  .post(protect, teacherOnly, createQuestion);

router.route('/:id')
  .put(protect, teacherOnly, updateQuestion)
  .delete(protect, teacherOnly, deleteQuestion);

router.route('/:id/status')
  .patch(protect, adminOnly, updateQuestionStatus);

export default router;
