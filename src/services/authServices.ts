import bcrypt from "bcrypt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import {
  UserRegister,
  UserLogin,
  forgotPW,
} from "@validations/user.validation";
import { ConflictError, NotFoundError, UnauthorizedError } from "@errors/api";
import { userExists } from "@utils";
import { sendEmail } from "../utils/emailSender"; 

export const registerUser = async (userData: UserRegister) => {
  const { username, first_name, last_name, email, phone, password } = userData;

  const existingEmail = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingEmail.length > 0) {
    throw new ConflictError("The email already exists!");
  }

  const existingUsername = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (existingUsername.length > 0) {
    throw new ConflictError("The username already exists!");
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.insert(usersTable).values({
    first_name,
    last_name,
    username,
    email,
    phone,
    password: hashed,
  });

  const [newUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, result[0].insertId));

  return {
    message: "Registered successfully!",
    data: {
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      },
      token: generateToken({ id: newUser.id, email: newUser.email }, "24h"),
    },
    code: 200,
  };
};

// log in
export const loginUser = async (credentials: UserLogin) => {
  const {
    authenticator: { email, username },
    password,
  } = credentials;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      email
        ? eq(usersTable.email, email)
        : username
        ? eq(usersTable.username, username)
        : undefined
    );

  if (!user) {
    throw new UnauthorizedError("Invalid credentials - user not found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials - password mismatch");
  }

  const userData = {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    token: generateToken({ id: user.id, email: user.email }, "24h"),
  }

  return {
    message: "logged in successfully!",
    data: userData,
    code: 200,
  };
};

//logout
export const deleteAccountService = async (userId: number) => {
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  if (!userExists(userId)) {
    return {
      message: "Account not found!",
      data: null,
      code: 404,
    };
  }

  await db.delete(usersTable).where(eq(usersTable.id, userId));
  return {
    message: "Account deleted successfully! bye",
    data: null,
    code: 200,
  };
};

export const forgotPWService = async (data: forgotPW) => {
  const { email, username } = data;

  if (!email || !username) {
    throw new Error("Both email and username are required for password reset");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      email
        ? eq(usersTable.email, email)
        : username
        ? eq(usersTable.username, username)
        : undefined
    );

  if (!user) {
    throw new NotFoundError("No account found with these credentials");
  }

  const token = generateToken({ id: user.id, email: user.email }, "10m");

  const resetLink = `https://yourdomain.com/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <p style="margin: 20px 0;">
        <a href="${resetLink}" 
           style="background-color: #2563eb; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link to your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Instructions",
    html: htmlContent,
  });

  return {
    message: "Password reset instructions sent to your email",
    data: null,
    code: 200,
  };
};