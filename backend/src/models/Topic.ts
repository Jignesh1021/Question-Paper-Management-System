import mongoose, { Document, Schema } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  subjectId: mongoose.Types.ObjectId;
}

const topicSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  },
  { timestamps: true }
);

// Prevent duplicate topic names within the same subject
topicSchema.index({ name: 1, subjectId: 1 }, { unique: true });

const Topic = mongoose.model<ITopic>('Topic', topicSchema);

export default Topic;
