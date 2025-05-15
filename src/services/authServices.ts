import bcrypt from "bcrypt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import { UserRegister, UserLogin } from "@validations/user.validation";
import { ConflictError, UnauthorizedError } from "@errors/api";

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
      token: generateToken({ id: newUser.id, email: newUser.email }, "1h"),
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

  return {
    message: "logged in successfully!",
    data: {
      user: {
        /*
        TODO FIX: Privacy Violation
        ! The bellow code is sending the hashed PASSWORD to client via connection
        */
        user,
      },
      token: generateToken({ id: user.id, email: user.email }, "1h"),
    },
    code: 200,
  };
};

// TODO: this controller and its route should be changed to deleteAccount instead. (see details below)
// ! When user want to logout he might want to log in again,
// ! let the frontend devs handle the logout functionality.
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
