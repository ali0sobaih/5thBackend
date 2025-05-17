import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must include an uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Must include a lowercase letter",
  })
  .refine((val) => /\d/.test(val), { message: "Must include a number" })
  .refine((val) => /[^a-zA-Z0-9]/.test(val), {
    message: "Must include a special character",
  });

const phoneSchema = z
  .string({ required_error: "Phone number is required" })
  .transform((val) => val.replace(/[-\s]/g, ""))
  .refine(
    (val) => {
      // local (09XXXXXXXX)
      const isLocal = /^09\d{8}$/.test(val);
      // international (+9639XXXXXXXX)
      const isInternational = /^\+9639\d{8}$/.test(val);
      return isLocal || isInternational;
    },
    {
      message: "Must be a valid Syrian number (09XXXXXXXX or +963 9XXXXXXXX)",
    }
  );

const usernameSchema = z
  .string({ required_error: "username is required" })
  .min(1)
  .refine((val) => !/[/s]/.test(val));

export const registerUserSchema = z.object({
  username: usernameSchema,
  first_name: z.string({ required_error: "First name is required" }).min(1),
  last_name: z.string({ required_error: "Last name is required" }).min(1),
  email: z.string({ required_error: "Email is required" }).email(),
  phone: phoneSchema,
  password: passwordSchema,
});

const authenticatorSchema = z
  .object(
    {
      email: z.string().email().optional(),
      username: usernameSchema.optional(),
    },
    { required_error: "You must specify one of (Email or Username)" }
  )
  .refine(
    ({ email, username }) => (email || username) && !(email && username),
    {
      message: "You must specify one of (Email or Username)",
    }
  );

export const loginUserSchema = z.object({
  authenticator: authenticatorSchema,
  password: z.string({ required_error: "Password is required" }),
});

export type UserRegister = z.infer<typeof registerUserSchema>;
export type UserLogin = z.infer<typeof loginUserSchema>;
