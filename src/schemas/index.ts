import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Email is required",
  }),
});

export const CardSchema = z.object({
  showEmail: z.boolean(),
  showPhoneNumber: z.boolean(),
  websiteUrl: z.string().max(256).nullable(),
  profession: z.string().max(256).nullable(),
  socialMediaLinks: z
    .object({
      instagram: z.string().max(256).nullable(),
      twitter: z.string().max(256).nullable(),
      linkedIn: z.string().max(256).nullable(),
    })
    .nullable(),
  bio: z.string().max(1024).nullable(),
  skills: z.array(z.string()).nullable(),
  visibility: z.enum(["public", "private"]),
});
