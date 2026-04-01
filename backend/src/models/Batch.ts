import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  name: string;
  description?: string;
  students: mongoose.Types.ObjectId[];
}

const batchSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Batch = mongoose.model<IBatch>('Batch', batchSchema);

export default Batch;
