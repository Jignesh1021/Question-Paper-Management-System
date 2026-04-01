import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  paperId: mongoose.Types.ObjectId;
  answers: {
    questionId: mongoose.Types.ObjectId;
    providedAnswer: string;
    marksAwarded: number;
    isCorrect: boolean;
  }[];
  totalMarksObtained: number;
  status: 'In-Progress' | 'Submitted' | 'Pending Review' | 'Evaluated';
  startedAt: Date;
  submittedAt?: Date;
}

const submissionSchema: Schema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPaper', required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        providedAnswer: { type: String, default: '' },
        marksAwarded: { type: Number, default: 0 },
        isCorrect: { type: Boolean, default: false },
      }
    ],
    totalMarksObtained: { type: Number, default: 0 },
    status: { type: String, enum: ['In-Progress', 'Submitted', 'Pending Review', 'Evaluated'], default: 'In-Progress' },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date }
  },
  { timestamps: true }
);

const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);

export default Submission;
