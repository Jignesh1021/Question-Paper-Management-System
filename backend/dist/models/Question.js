"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    subjectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subject', required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'Short', 'Long'], required: true },
    options: [{ type: String }],
    correctAnswers: [{ type: String, required: true }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    marks: { type: Number, required: true },
    tags: [{ type: String }],
}, { timestamps: true });
const Question = mongoose_1.default.model('Question', questionSchema);
exports.default = Question;
