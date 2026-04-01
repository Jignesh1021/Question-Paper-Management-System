import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  title: string;
  paperId: mongoose.Types.ObjectId;
  assignedBatches: mongoose.Types.ObjectId[];
  assignedStudents: mongoose.Types.ObjectId[];
  assignedBy: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  isMock: boolean;
  maxAttempts: number;
  status: 'Scheduled' | 'Active' | 'Completed';
}

const examSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', required: true },
    assignedBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    isMock: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    status: { type: String, enum: ['Scheduled', 'Active', 'Completed'], default: 'Scheduled' },
  },
  { timestamps: true }
);

const Exam = mongoose.model<IExam>('Exam', examSchema);

export default Exam;
