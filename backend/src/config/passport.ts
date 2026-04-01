import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          // Alternatively, find by email if they already created an account with that email
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
          if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              // Link Google account to existing email
              existingUser.googleId = profile.id;
              existingUser.profilePicture = profile.photos ? profile.photos[0].value : existingUser.profilePicture;
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: email || `${profile.id}@google.oauth`,
            profilePicture: profile.photos ? profile.photos[0].value : '',
            role: 'student', // Default role
          });
          return done(null, user);
        }
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
