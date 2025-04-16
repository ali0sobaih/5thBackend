import bcrypt from "bcrypt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import { UserRegister, UserLogin } from "@validations/user.validation";
import { ConflictError, UnauthorizedError } from "@errors/api";

export const registerUser = async (userData: UserRegister) => {
  const { first_name, last_name, email, phone, password } = userData;

  const existingEmail = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingEmail.length > 0) {
    throw new ConflictError("The email already exists!");
  }

  const user_name = `${first_name.toLowerCase()}_${last_name.toLowerCase()}`;
  const hashed = await bcrypt.hash(password, 10);

  const result = await db.insert(usersTable).values({
    first_name,
    last_name,
    user_name,
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
        userName: newUser.user_name,
        email: newUser.email,
        phone: newUser.phone,
      },
      token: generateToken({ id: newUser.id, email: newUser.email }, "1h"),
    },
    code: 200,
  };
};

// log in
export const loginUser = async (credentials: UserLogin) => {
  const { email, password } = credentials;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user) {
    throw new UnauthorizedError("Invalid credentials - user not found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials - password mismatch");
  }

  return {
    message: "logged in successfully!",
    data: {
      user: {
        user,
      },
      token: generateToken({ id: user.id, email: user.email }, "1h"),
    },
    code: 200,
  };
};

//logout
export const logoutUser = async (userId: number) => {
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  await db.delete(usersTable).where(eq(usersTable.id, userId));
  return {
    message: "logged out successfully!",
    data: null,
    code: 200,
  };
};
