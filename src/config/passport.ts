import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '@db/connection';
import { usersTable } from '@db/schemas/users';
import { eq } from 'drizzle-orm';
import { generateToken } from '@utils/generateToken';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['profile', 'email'],
    state: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found"), undefined);

        // البحث بالمستخدم عن طريق Google ID أو Email
        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.google_id, profile.id));

        if (existingUser) return done(null, existingUser);

        const [userByEmail] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (userByEmail) {
            // تحديث المستخدم بإضافة Google ID
            await db
                .update(usersTable)
                .set({ google_id: profile.id })
                .where(eq(usersTable.id, userByEmail.id));
            return done(null, userByEmail);
        }

        // إنشاء مستخدم جديد
        const newUser = {
            first_name: profile.name?.givenName || 'Google',
            last_name: profile.name?.familyName || 'User',
            email: email,
            google_id: profile.id,
            password: '', // لا حاجة لكلمة المرور
            token_version: 1
        };

        const result = await db.insert(usersTable).values(newUser);
        const [createdUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, result[0].insertId));

        done(null, createdUser);
    } catch (error) {
        done(error as Error);
    }
}));

// Serialization
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialization
passport.deserializeUser(async (id: number, done) => {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));
    done(null, user);
});