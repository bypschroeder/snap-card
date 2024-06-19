import * as z from "zod";
import validator from "validator";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  userName: z.string().min(1, {
    message: "User Name is required",
  }),
  firstName: z.string().max(256, {
    message: "First name is required",
  }),
  lastName: z.string().max(256, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const UserSchema = z.object({
  userName: z.string().min(1, {
    message: "User Name is required",
  }),
  firstName: z.string().max(256, {
    message: "First name is required",
  }),
  lastName: z.string().max(256, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
});

export const PasswordUpdateSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current Password is required",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters",
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

export const CreateCardSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required",
  }),
  cardName: z.string().min(1, {
    message: "Card Name is required",
  }),
  cardUrl: z.string().min(1, {
    message: "Card URL is required",
  }),
  cardVisibility: z.enum(["public", "private"]),
});

export const UpdateCardOverviewSchema = z.object({
  profileImageId: z.number().nullable(),
  firstName: z
    .string()
    .min(1, {
      message: "First Name is required",
    })
    .max(256),
  lastName: z
    .string()
    .min(1, {
      message: "Last Name is required",
    })
    .max(256),
  bio: z.string().max(1024).nullable().optional(),
  profession: z.array(
    z.object({
      name: z.string().max(256).nullable().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string().max(256).nullable().optional(),
    }),
  ),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        return val === "" || validator.isMobilePhone(val);
      },
      {
        message: "Invalid phone number",
      },
    ),
});

const urlOrEmpty = z.string().refine(
  (value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid URL",
  },
);

export const UpdateCardSocialsSchema = z.object({
  socialMediaLinks: z.array(
    z.object({
      url: urlOrEmpty.nullable().optional(),
    }),
  ),
  websiteUrl: urlOrEmpty.nullable().optional(),
});

export const UpdateCardSettingsSchema = z.object({
  cardName: z
    .string()
    .min(1, {
      message: "Card Name is required",
    })
    .max(256),
  cardUrl: z
    .string()
    .min(1, {
      message: "Card URL is required",
    })
    .max(1024)
    .optional(),
  cardVisibility: z.enum(["public", "private"]).optional(),
});

export const ImageSchema = z.object({
  images: z.array(z.instanceof(File)),
});
