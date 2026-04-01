import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import subjectRoutes from './routes/subjectRoutes';
import questionRoutes from './routes/questionRoutes';
import paperRoutes from './routes/paperRoutes';
import topicRoutes from './routes/topicRoutes';
import batchRoutes from './routes/batchRoutes';
import examRoutes from './routes/examRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('QPMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
