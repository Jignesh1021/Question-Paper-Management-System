import { Request, Response } from 'express';
import Batch from '../models/Batch';
import User from '../models/User';

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
export const getBatches = async (req: Request, res: Response) => {
  try {
    const batches = await Batch.find().populate('students', 'name email');
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a batch
// @route   POST /api/batches
// @access  Private/Admin
export const createBatch = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const batchExists = await Batch.findOne({ name });
    if (batchExists) {
      return res.status(400).json({ message: 'Batch already exists' });
    }
    const batch = await Batch.create({ name, description });
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a student to a batch
// @route   POST /api/batches/:id/students
// @access  Private/Admin
export const addStudentToBatch = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
        return res.status(400).json({ message: 'Valid student ID required' });
    }

    if (!batch.students.includes(studentId)) {
      batch.students.push(studentId);
      await batch.save();
      
      // Also update student's batchId reference
      student.batchId = batch._id as any;
      await student.save();
    }

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
