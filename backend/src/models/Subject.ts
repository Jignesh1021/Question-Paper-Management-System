import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  batches: mongoose.Types.ObjectId[];
}

const subjectSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  },
  { timestamps: true }
);

const Subject = mongoose.model<ISubject>('Subject', subjectSchema);

export default Subject;
