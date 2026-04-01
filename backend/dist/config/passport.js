"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User_1.default.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }
            else {
                // Alternatively, find by email if they already created an account with that email
                const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
                if (email) {
                    const existingUser = await User_1.default.findOne({ email });
                    if (existingUser) {
                        // Link Google account to existing email
                        existingUser.googleId = profile.id;
                        existingUser.profilePicture = profile.photos ? profile.photos[0].value : existingUser.profilePicture;
                        await existingUser.save();
                        return done(null, existingUser);
                    }
                }
                // Create new user
                user = await User_1.default.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: email || `${profile.id}@google.oauth`,
                    profilePicture: profile.photos ? profile.photos[0].value : '',
                    role: 'student', // Default role
                });
                return done(null, user);
            }
        }
        catch (error) {
            return done(error, undefined);
        }
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser(async (id, done) => {
        try {
            const user = await User_1.default.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    });
}
exports.default = passport_1.default;
