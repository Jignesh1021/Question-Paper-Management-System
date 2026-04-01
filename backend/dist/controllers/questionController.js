"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestions = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const Subject_1 = __importDefault(require("../models/Subject"));
// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
    try {
        const { subjectId, type, difficulty, tags } = req.query;
        // Build query object dynamically
        const query = {};
        if (subjectId)
            query.subjectId = subjectId;
        if (type)
            query.type = type;
        if (difficulty)
            query.difficulty = difficulty;
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }
        const questions = await Question_1.default.find(query).populate('subjectId', 'name code');
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error fetching questions' });
    }
};
exports.getQuestions = getQuestions;
// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (Teacher/Admin only)
const createQuestion = async (req, res) => {
    try {
        const { subjectId, text, type, options, correctAnswers, difficulty, marks, tags } = req.body;
        // Validate subject exists
        const subjectExists = await Subject_1.default.findById(subjectId);
        if (!subjectExists) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        if (type === 'MCQ' && (!options || options.length < 2)) {
            res.status(400).json({ message: 'MCQ type requires at least 2 options' });
            return;
        }
        const question = await Question_1.default.create({
            subjectId,
            text,
            type,
            options: type === 'MCQ' ? options : undefined,
            correctAnswers,
            difficulty,
            marks,
            tags
        });
        res.status(201).json(question);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error creating question' });
    }
};
exports.createQuestion = createQuestion;
// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Teacher/Admin only)
const updateQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }
        const updatedQuestion = await Question_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updatedQuestion);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error updating question' });
    }
};
exports.updateQuestion = updateQuestion;
// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher/Admin only)
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }
        await question.deleteOne();
        res.json({ message: 'Question removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error deleting question' });
    }
};
exports.deleteQuestion = deleteQuestion;
