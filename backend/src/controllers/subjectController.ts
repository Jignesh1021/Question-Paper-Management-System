import { Request, Response } from 'express';
import Subject from '../models/Subject';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as any;
    let query = {};
    
    if (user.role === 'teacher') {
       query = { batches: { $in: user.teacherBatches || [] } };
    } else if (user.role === 'student') {
       const userBatches = [user.batchId, ...(user.optionalBatches || [])].filter(Boolean);
       query = { batches: { $in: userBatches } };
    }
    
    const subjects = await Subject.find(query).populate('batches', 'name');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error pulling subjects' });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Admin only)
export const createSubject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description, batches } = req.body;
    
    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
      res.status(400).json({ message: 'Subject with this code already exists' });
      return;
    }

    const subject = await Subject.create({
      name,
      code,
      description,
      batches: batches || []
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating subject' });
  }
};
