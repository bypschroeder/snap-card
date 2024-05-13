"use server";

import type * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "~/schemas";
import { signIn } from "~/auth";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { generateVerificationToken } from "~/lib/token";
import { getUserByEmail } from "~/data/user";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUserArray = await getUserByEmail(email);
  let existingUser;
  if (existingUserArray) {
    existingUser =
      existingUserArray.length > 0 ? existingUserArray[0] : null;
  }

  if (!existingUser?.email || !existingUser?.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = generateVerificationToken(existingUser.email);
    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};