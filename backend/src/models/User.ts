import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'admin' | 'teacher' | 'student';
  batchId?: mongoose.Types.ObjectId; // Primary student batch
  optionalBatches?: mongoose.Types.ObjectId[]; // Electives/Labs for students
  teacherBatches?: mongoose.Types.ObjectId[]; // Authorized batches for teachers
  profilePicture?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String },
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
    optionalBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    teacherBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    profilePicture: { type: String },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
