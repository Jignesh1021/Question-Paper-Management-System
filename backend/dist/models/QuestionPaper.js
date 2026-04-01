"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionPaperSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    subjectId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Subject', required: true },
    totalMarks: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    questions: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Question' }],
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { timestamps: true });
const QuestionPaper = mongoose_1.default.model('QuestionPaper', questionPaperSchema);
exports.default = QuestionPaper;
