import express from 'express';
import { getTopics, createTopic, deleteTopic } from '../controllers/topicController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTopics)
  .post(protect, adminOnly, createTopic);

router.route('/:id')
  .delete(protect, adminOnly, deleteTopic);

export default router;
