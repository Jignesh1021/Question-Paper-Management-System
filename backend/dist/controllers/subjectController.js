"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubject = exports.getSubjects = void 0;
const Subject_1 = __importDefault(require("../models/Subject"));
// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject_1.default.find({});
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error pulling subjects' });
    }
};
exports.getSubjects = getSubjects;
// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private (Admin only)
const createSubject = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        const subjectExists = await Subject_1.default.findOne({ code });
        if (subjectExists) {
            res.status(400).json({ message: 'Subject with this code already exists' });
            return;
        }
        const subject = await Subject_1.default.create({
            name,
            code,
            description
        });
        res.status(201).json(subject);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error creating subject' });
    }
};
exports.createSubject = createSubject;
