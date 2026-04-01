import express from 'express';
import { assignExam, getTeacherExams, getStudentExams, startExam, submitExam, getStudentSubmissions, evaluateSubmission, getTeacherSubmissions } from '../controllers/examController';
import { protect, teacherOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/assign', protect, teacherOnly, assignExam);
router.get('/teacher', protect, teacherOnly, getTeacherExams);
router.get('/teacher/submissions', protect, teacherOnly, getTeacherSubmissions);
router.get('/student', protect, getStudentExams);
router.get('/submissions', protect, getStudentSubmissions);

router.post('/:id/start', protect, startExam);
router.post('/:id/submit', protect, submitExam);

router.post('/submissions/:subId/evaluate', protect, teacherOnly, evaluateSubmission);

export default router;
