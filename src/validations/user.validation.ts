import { z } from 'zod';

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((val) => /[A-Z]/.test(val), { message: 'Must include an uppercase letter' })
  .refine((val) => /[a-z]/.test(val), { message: 'Must include a lowercase letter' })
  .refine((val) => /\d/.test(val), { message: 'Must include a number' })
  .refine((val) => /[^a-zA-Z0-9]/.test(val), { message: 'Must include a special character' });

  const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .transform(val => val.replace(/[-\s]/g, '')) 
  .refine((val) => {
    // local (09XXXXXXXX)
    const isLocal = /^09\d{8}$/.test(val);
    // international (+9639XXXXXXXX)
    const isInternational = /^\+9639\d{8}$/.test(val);
    return isLocal || isInternational;
  }, {
    message: 'Must be a valid Syrian number (09XXXXXXXX or +963 9XXXXXXXX)'
  });

export const registerUserSchema = z
  .object({
    first_name: z.string({ required_error: 'First name is required' }).min(1),
    last_name: z.string({ required_error: 'Last name is required' }).min(1),
    email: z.string({ required_error: 'Email is required' }).email(),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const loginUserSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z.string({ required_error: 'Password is required' })
});

export type UserRegister = z.infer<typeof registerUserSchema>;
export type UserLogin = z.infer<typeof loginUserSchema>;