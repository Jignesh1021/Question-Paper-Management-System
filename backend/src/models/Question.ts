import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  batchId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  text: string;
  type: 'MCQ' | 'Short' | 'Long';
  options?: string[]; // Only for MCQ
  correctAnswers: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  tags: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

const questionSchema: Schema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'Short', 'Long'], required: true },
    options: [{ type: String }],
    correctAnswers: [{ type: String, required: true }],
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    marks: { type: Number, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
