import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).populate('batchId').populate('optionalBatches').populate('teacherBatches');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error pulling users' });
  }
};

// @desc    Register a user via Admin
// @route   POST /api/users/register-by-admin
// @access  Private/Admin
export const registerUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, batchId, optionalBatches, teacherBatches } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      batchId: role === 'student' ? batchId : undefined,
      optionalBatches: role === 'student' ? optionalBatches : undefined,
      teacherBatches: role === 'teacher' ? teacherBatches : undefined
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error registering user' });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    
    if (user.role === 'student') {
       user.batchId = req.body.batchId || user.batchId;
       user.optionalBatches = req.body.optionalBatches || user.optionalBatches;
    } else if (user.role === 'teacher') {
       user.teacherBatches = req.body.teacherBatches || user.teacherBatches;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating user' });
  }
};
