"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { getPasswordResetTokenByToken } from "~/data/password-reset-token";
import { getUserByEmail } from "~/data/user";

import { NewPasswordSchema } from "~/schemas";
import { db } from "~/server/db";
import { passwordResetTokens, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFiels = NewPasswordSchema.safeParse(values);

  if (!validatedFiels.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFiels.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (existingUser && existingUser.length > 0) {
    const [user] = existingUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user!.id));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    return { success: "Password updated!"}
  } else {
    return { error: "Email does not exist" };
  }
};
