import express from 'express';
import passport from 'passport';
import { authUser, registerUser, googleAuthCallback } from '../controllers/authController';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);

// Google OAuth Routing
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=auth_failed', session: false }),
  googleAuthCallback
);

export default router;
