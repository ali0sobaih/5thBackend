import bcrypt from "bcrypt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import { UserRegister, UserLogin } from "@validations/user.validation";
import { ConflictError, UnauthorizedError } from "@errors/api";

const userProjection = {
  id: usersTable.id,
  email: usersTable.email,
  first_name: usersTable.first_name,
  last_name: usersTable.last_name,
  password: usersTable.password,
  token_version: usersTable.token_version,
  google_id: usersTable.google_id
};

export const registerUser = async (userData: UserRegister) => {
  const { first_name, last_name, email, phone, password } = userData;

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ConflictError("Password must contain at least 8 characters, one uppercase, one lowercase and one number");
  }

  const existingEmail = await db
    .select({ email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingEmail.length > 0) {
    throw new ConflictError("The email already exists!");
  }

  const user_name = `${first_name.toLowerCase()}_${last_name.toLowerCase()}`;
  const hashed = await bcrypt.hash(password, 12); // زيادة cost factor

  const result = await db.insert(usersTable).values({
    first_name,
    last_name,
    user_name,
    email,
    phone,
    password: hashed,
    token_version: 1
  });

  const [newUser] = await db
    .select(userProjection)
    .from(usersTable)
    .where(eq(usersTable.id, result[0].insertId));

  return {
    message: "Registered successfully!",
    data: {
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email
      },
      token: generateToken({ 
        id: newUser.id, 
        email: newUser.email,
        authStrategy: 'local',
        token_version: newUser.token_version
      }, "1h"),
    },
    code: 200,
  };
};

export const loginUser = async (credentials: UserLogin) => {
  const { email, password } = credentials;

  const [user] = await db
    .select(userProjection)
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (user.google_id) {
    throw new UnauthorizedError("Please use Google login");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return {
    message: "Logged in successfully!",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token: generateToken({ 
        id: user.id, 
        email: user.email,
        authStrategy: 'local',
        token_version: user.token_version
      }, "1h"),
    },
    code: 200,
  };
};

export const logoutUser = async (userId: number) => {
  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  const [user] = await db
    .select({ token_version: usersTable.token_version })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  await db
    .update(usersTable)
    .set({ token_version: user.token_version + 1 })
    .where(eq(usersTable.id, userId));

  return {
    message: "Logged out successfully!",
    data: null,
    code: 200,
  };
};

export const findOrCreateGoogleUser = async (profile: any) => {
  try {
    const [existingUser] = await db
      .select(userProjection)
      .from(usersTable)
      .where(eq(usersTable.google_id, profile.id));

    if (existingUser) {
      return {
        user: existingUser,
        token: generateToken({
          id: existingUser.id,
          email: existingUser.email,
          authStrategy: 'google',
          token_version: existingUser.token_version
        }, "1h")
      };
    }

    const email = profile.emails?.[0].value;
    if (!email) throw new ConflictError("Google account email required");

    const [emailUser] = await db
      .select(userProjection)
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (emailUser) {
      await db
        .update(usersTable)
        .set({ 
          google_id: profile.id,
          token_version: emailUser.token_version + 1
        })
        .where(eq(usersTable.id, emailUser.id));

      return {
        user: { ...emailUser, google_id: profile.id },
        token: generateToken({
          id: emailUser.id,
          email: emailUser.email,
          authStrategy: 'google',
          token_version: emailUser.token_version + 1
        }, "1h")
      };
    }

    const newUserData = {
      first_name: profile.name?.givenName || 'Google',
      last_name: profile.name?.familyName || 'User',
      email: email,
      password: '',
      user_name: profile.displayName?.toLowerCase().replace(/\s+/g, '_') || `user_${Date.now()}`,
      google_id: profile.id,
      token_version: 1
    };

    const result = await db.insert(usersTable).values(newUserData);
    const [createdUser] = await db
      .select(userProjection)
      .from(usersTable)
      .where(eq(usersTable.id, result[0].insertId));

    return {
      user: createdUser,
      token: generateToken({
        id: createdUser.id,
        email: createdUser.email,
        authStrategy: 'google',
        token_version: createdUser.token_version
      }, "1h")
    };
  } catch (error) {
    console.error("Google auth error:", error);
    throw new ConflictError("Google authentication failed");
  }
};