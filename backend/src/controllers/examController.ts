import { Request, Response } from 'express';
import Exam from '../models/Exam';
import Submission from '../models/Submission';
import QuestionPaper from '../models/QuestionPaper';

// @desc    Assign a new Exam
// @route   POST /api/exams/assign
// @access  Private/Teacher
export const assignExam = async (req: Request, res: Response) => {
  try {
    const { title, paperId, assignedBatches, assignedStudents, startTime, endTime, durationMinutes, isMock, maxAttempts } = req.body;

    // Validate inputs
    if (!title || !paperId || !startTime || !endTime || !durationMinutes) {
      return res.status(400).json({ message: 'Missing required assignment parameters' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const exam = await Exam.create({
      title,
      paperId,
      assignedBatches: assignedBatches || [],
      assignedStudents: assignedStudents || [],
      assignedBy: (req.user as any)?._id,
      startTime: start,
      endTime: end,
      durationMinutes,
      isMock: Boolean(isMock),
      maxAttempts: maxAttempts || 1,
      status: 'Scheduled'
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error scheduling exam' });
  }
};

// @desc    Get exams assigned by teacher
// @route   GET /api/exams/teacher
// @access  Private/Teacher
export const getTeacherExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find({ assignedBy: (req.user as any)._id })
                            .populate('paperId', 'title totalMarks')
                            .populate('assignedBatches', 'name');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error pulling scheduled exams' });
  }
};

// @desc    Get exams targeted at the logged-in student
// @route   GET /api/exams/student
// @access  Private/Student
export const getStudentExams = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    // Find all exams where either user is directly assigned OR batch matched
    const query: any = {
      $or: [
        { assignedStudents: user._id }
      ]
    };

    if (user.batchId) {
      query.$or.push({ assignedBatches: user.batchId });
    }

    const exams = await Exam.find(query)
                            .populate('paperId', 'title totalMarks durationMinutes')
                            .sort({ startTime: 1 }); // Sort chronologically

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error pulling student assignments' });
  }
};

// @desc    Start an exam session
// @route   POST /api/exams/:id/start
// @access  Private/Student
export const startExam = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const examId = req.params.id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Check if within time window
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
       return res.status(403).json({ message: 'Outside operational deployment window' });
    }

    // Check existing mapping
    const existing = await Submission.findOne({ examId, studentId: user._id });
    if (existing) {
       if (existing.status !== 'In-Progress') {
         return res.status(403).json({ message: 'Deployment already executed by this operator' });
       }
       
       const paper = await QuestionPaper.findById(exam.paperId).populate('questions');
       return res.json({ submission: existing, exam, paper });
    }

    const submission = await Submission.create({
       examId,
       studentId: user._id,
       paperId: exam.paperId,
       status: 'In-Progress',
       startedAt: new Date()
    });
    
    const paper = await QuestionPaper.findById(exam.paperId).populate('questions');

    res.status(201).json({ submission, exam, paper });
  } catch (error) {
    res.status(500).json({ message: 'Server Error instantiating execution session' });
  }
};

// @desc    Submit answers and execute auto-grading pipeline
// @route   POST /api/exams/:id/submit
// @access  Private/Student
export const submitExam = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const examId = req.params.id;
    const { answers } = req.body; // Array of { questionId, providedAnswer }

    const submission = await Submission.findOne({ examId, studentId: user._id });
    if (!submission) return res.status(404).json({ message: 'Active session not found' });

    if (submission.status !== 'In-Progress') {
       return res.status(400).json({ message: 'Session already finalized' });
    }

    // Pull Blueprint to access verifiable keys
    const paper = await QuestionPaper.findById(submission.paperId).populate('questions');
    if (!paper) return res.status(404).json({ message: 'Blueprint signature vanished' });

    let totalMarks = 0;
    const evaluatedAnswers: any[] = [];
    let hasDescriptive = false;

    for (const ans of answers) {
       // Find the specific question configuration
       const qDef: any = (paper.questions as any[]).find(q => q._id.toString() === ans.questionId);
       
       if (qDef) {
          if (qDef.type !== 'MCQ') hasDescriptive = true;

          const isCorrect = qDef.type === 'MCQ' ? qDef.correctAnswers.some((val: string) => val.toLowerCase() === ans.providedAnswer?.toLowerCase()) : false;
          const marksAwarded = isCorrect ? qDef.marks : 0;
          
          totalMarks += marksAwarded;
          
          evaluatedAnswers.push({
             questionId: ans.questionId,
             providedAnswer: ans.providedAnswer,
             isCorrect,
             marksAwarded
          });
       }
    }

    submission.answers = evaluatedAnswers;
    submission.totalMarksObtained = totalMarks;
    submission.status = hasDescriptive ? 'Pending Review' : 'Evaluated';
    submission.submittedAt = new Date();

    await submission.save();
    
    res.json({ message: 'Execution complete', totalScore: totalMarks });
  } catch (error) {
    res.status(500).json({ message: 'Server Error closing execution stream' });
  }
};

// @desc    Get submissions for logged in user
export const getStudentSubmissions = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const subs = await Submission.find({ studentId: user._id })
       .populate({
         path: 'examId',
         select: 'title startTime endTime',
         populate: { path: 'paperId', select: 'totalMarks' }
       })
       .sort({ submittedAt: -1 });

    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error pulling past records' });
  }
};

// @desc    Get pending review submissions for teacher's exams
// @route   GET /api/exams/teacher/submissions
// @access  Private/Teacher
export const getTeacherSubmissions = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    // Step 1: Find all exams assigned by this teacher
    const exams = await Exam.find({ assignedBy: user._id }).select('_id title targetBatch');
    const examIds = exams.map(e => e._id);

    // Step 2: Find submissions for these exams that are 'Pending Review'
    const submissions = await Submission.find({ 
      examId: { $in: examIds },
      status: 'Pending Review'
    })
    .populate('studentId', 'name email batchId')
    .populate({
      path: 'examId',
      select: 'title assignedBatches',
      populate: { path: 'assignedBatches', select: 'name' }
    })
    .populate({
      path: 'paperId',
      select: 'title totalMarks questions',
      populate: { path: 'questions', select: 'text type marks' }
    })
    .sort({ submittedAt: 1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error pulling pending evaluations' });
  }
};

// @desc    Teacher manually evaluates a submission
// @route   POST /api/exams/submissions/:subId/evaluate
// @access  Private/Teacher
export const evaluateSubmission = async (req: Request, res: Response) => {
  try {
     const { grading } = req.body; // Array of { questionId, marksAwarded }
     const { subId } = req.params;

     const submission = await Submission.findById(subId);
     if (!submission) return res.status(404).json({ message: 'Submission not found' });

     let additionalMarks = 0;

     for (const grade of grading) {
        const answerRecord = submission.answers.find(a => a.questionId.toString() === grade.questionId);
        if (answerRecord) {
           answerRecord.marksAwarded = grade.marksAwarded;
           answerRecord.isCorrect = grade.marksAwarded > 0;
           additionalMarks += grade.marksAwarded;
        }
     }

     submission.totalMarksObtained += additionalMarks;
     submission.status = 'Evaluated';
     
     await submission.save();

     res.json(submission);
  } catch (error) {
     res.status(500).json({ message: 'Server Error committing manual evaluation' });
  }
};
