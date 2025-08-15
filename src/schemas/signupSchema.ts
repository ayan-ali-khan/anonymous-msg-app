import {email, z} from 'zod';

export const usernameValidation =  z
    .string()
    .min(3, "Username must be atleast 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
})