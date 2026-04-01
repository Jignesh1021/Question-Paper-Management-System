import { Request, Response } from 'express';
import Question from '../models/Question';
import Subject from '../models/Subject';

// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId, type, difficulty, tags } = req.query;
    const user = req.user as any;
    
    // Build query object dynamically
    const query: any = {};
    
    // Hard lock isolation
    if (user.role === 'teacher') {
       query.batchId = { $in: user.teacherBatches || [] };
    }

    if (subjectId) query.subjectId = subjectId;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (req.query.status) query.status = req.query.status;
    if (req.query.topicId) query.topicId = req.query.topicId;
    if (req.query.batchId) {
      if (user.role === 'admin' || (user.role === 'teacher' && user.teacherBatches?.includes(req.query.batchId))) {
        query.batchId = req.query.batchId;
      }
    }
    
    if (tags) {
      query.tags = { $in: (tags as string).split(',') };
    }

    const questions = await Question.find(query)
      .populate('subjectId', 'name code')
      .populate('topicId', 'name')
      .populate('createdBy', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching questions' });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (Teacher/Admin only)
  export const createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { batchId, subjectId, topicId, text, type, options, correctAnswers, difficulty, marks, tags } = req.body;
      const user = req.user as any;
  
      if (!batchId) {
         res.status(400).json({ message: 'Blueprint queries must be explicitly bound to a primary Batch' });
         return;
      }

      if (user.role === 'teacher' && !user.teacherBatches?.map((b:any)=>b.toString()).includes(batchId.toString())) {
         res.status(403).json({ message: 'Security Exception: Teacher not authorized for this batch assignment' });
         return;
      }

      // Validate subject exists
      const subjectExists = await Subject.findById(subjectId);
      if (!subjectExists) {
        res.status(404).json({ message: 'Subject not found' });
        return;
      }

    if (type === 'MCQ' && (!options || options.length < 2)) {
      res.status(400).json({ message: 'MCQ type requires at least 2 options' });
      return;
    }

      const question = await Question.create({
        batchId,
        subjectId,
        topicId,
        createdBy: user._id,
        text,
        type,
        options: type === 'MCQ' ? options : undefined,
        correctAnswers,
        difficulty,
        marks,
        tags,
        status: 'Pending' // Requires Admin or AI automated approval
      });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating question' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Teacher/Admin only)
export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating question' });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher/Admin only)
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    await question.deleteOne();
    res.json({ message: 'Question removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting question' });
  }
};

// @desc    Update a question's moderation status
// @route   PATCH /api/questions/:id/status
// @access  Private/Admin
export const updateQuestionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      res.status(400).json({ message: 'Invalid status type' });
      return;
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    question.status = status as any;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating question status' });
  }
};
