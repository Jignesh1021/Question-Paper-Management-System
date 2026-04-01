"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaper = exports.getPaperById = exports.getPapers = void 0;
const QuestionPaper_1 = __importDefault(require("../models/QuestionPaper"));
const Question_1 = __importDefault(require("../models/Question"));
// @desc    Get all question papers
// @route   GET /api/papers
// @access  Private
const getPapers = async (req, res) => {
    try {
        const papers = await QuestionPaper_1.default.find({})
            .populate('subjectId', 'name code')
            .populate('createdBy', 'name email');
        res.json(papers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error pulling papers' });
    }
};
exports.getPapers = getPapers;
// @desc    Get single question paper by ID
// @route   GET /api/papers/:id
// @access  Private
const getPaperById = async (req, res) => {
    try {
        const paper = await QuestionPaper_1.default.findById(req.params.id)
            .populate('subjectId', 'name code')
            .populate('createdBy', 'name email')
            .populate('questions');
        if (!paper) {
            res.status(404).json({ message: 'Paper not found' });
            return;
        }
        res.json(paper);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error pulling paper' });
    }
};
exports.getPaperById = getPaperById;
// Helper: Shuffle array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
// @desc    Auto Generate a Question Paper
// @route   POST /api/papers/generate
// @access  Private (Teacher/Admin only)
const generatePaper = async (req, res) => {
    try {
        const { title, subjectId, totalMarks, durationMinutes, criteria } = req.body;
        // criteria could include {"Easy": 30, "Medium": 50, "Hard": 20} (percentages)
        // For MVP, we will just try to select any random questions that sum exactly to totalMarks
        const availableQuestions = await Question_1.default.find({ subjectId });
        // Shuffle available pool to ensure anti-repetition across multiple generates
        let pool = shuffleArray([...availableQuestions]);
        const selectedQuestions = [];
        let currentMarks = 0;
        for (const q of pool) {
            if (currentMarks + q.marks <= totalMarks) {
                selectedQuestions.push(q._id);
                currentMarks += q.marks;
            }
            if (currentMarks === totalMarks)
                break;
        }
        if (currentMarks !== totalMarks) {
            res.status(400).json({
                message: `Could not generate an exact paper of ${totalMarks} marks from the current question pool. Reached ${currentMarks}. Please add more varied questions.`
            });
            return;
        }
        const paper = await QuestionPaper_1.default.create({
            title,
            subjectId,
            totalMarks,
            durationMinutes,
            questions: selectedQuestions,
            createdBy: req.user?._id,
            status: 'Draft'
        });
        res.status(201).json(paper);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error generating paper' });
    }
};
exports.generatePaper = generatePaper;
