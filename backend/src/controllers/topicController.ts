import { Request, Response } from 'express';
import Topic from '../models/Topic';

// @desc    Get all topics (optionally filter by subjectId)
// @route   GET /api/topics
// @access  Private
export const getTopics = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.query;
    const filter = subjectId ? { subjectId } : {};
    const topics = await Topic.find(filter).populate('subjectId', 'name code');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private/Admin
export const createTopic = async (req: Request, res: Response) => {
  try {
    const { name, subjectId } = req.body;
    const topicExists = await Topic.findOne({ name, subjectId });
    if (topicExists) {
      return res.status(400).json({ message: 'Topic already exists for this subject' });
    }
    const topic = await Topic.create({ name, subjectId });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    await Topic.deleteOne({ _id: req.params.id });
    res.json({ message: 'Topic removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
