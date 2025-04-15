import bcrypt from "bcrypt";
import { db } from "@db/connection";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@utils/generateToken";
import { UserRegister, UserLogin } from "@validations/user.validation";
import { json } from "stream/consumers";
import { ServerError } from "@errors/serverErrors";

// register
export const registerUser = async (userData: UserRegister) => {
  try {
    const { first_name, last_name, email, phone, password } = userData;

    const existingEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingEmail.length > 0) {
      return {
        message: "The email already exists!",
        data: null,
        code: 409,
      };
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
  } catch (err) {
    throw new ServerError("Something went wrong while registering", err);
  }
};

// log in
export const loginUser = async (credentials: UserLogin) => {
  try{
    const { email, password } = credentials;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return {
        message: "Invalid credentials - user not found",
        data: null,
        code: 401,
      };
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return {
        message: "Invalid credentials - password mismatch",
        data: null,
        code: 401,
      };
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
  }
  catch (err) {
    throw new ServerError("Something went wrong while registering", err);
  }
};

//logout
export const logoutUser = async (userId: number) => {
  try {
    if (!userId) {
      return {
        message: "User not authenticated",
        data: null,
        code: 401,
      };
    }

    await db.delete(usersTable).where(eq(usersTable.id, userId));
    return {
      message: "logged out successfully!",
      data: null,
      code: 200,
    };
  } catch (err) {
    throw new ServerError("Something went wrong while registering", err);
  }
};
