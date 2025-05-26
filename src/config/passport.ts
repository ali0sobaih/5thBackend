// src/middlewares/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '@db/connection';
import { usersTable } from '@db/schemas/users';
import { eq } from 'drizzle-orm';
import { findOrCreateGoogleUser } from '@services/authServices';
import type { Request } from 'express';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.API_URL}/auth/google/callback`, // استخدام متغير بيئي
    scope: ['profile', 'email'],
    state: true, // حماية من CSRF
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (!profile.emails?.[0]?.value) {
            return done(new Error("Google account email is required"), null);
        }
        const { user, token } = await findOrCreateGoogleUser(profile);
        return done(null, { ...user, token }, { token });
    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(new Error('Failed to authenticate with Google'), null);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, {
        id: user.id,
        token: user.token 
    });
});

passport.deserializeUser(async (serialized: { id: number; token: string }, done) => {
    try {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, serialized.id));

        if (!user) return done(new Error("User not found"), null);
        done(null, {
            id: user.id,
            email: user.email,
            authStrategy: user.google_id ? 'google' : 'local',
            token: serialized.token
        });
    } catch (error) {
        done(error, null);
    }
});