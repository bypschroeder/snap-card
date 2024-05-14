"use server";

import type * as z from "zod";

import { ResetSchema } from "~/schemas";
import { getUserByEmail } from "~/data/user";
import { sendPasswordResetEmail } from "~/lib/mail";
import { generatePasswortResetToken } from "~/lib/token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.length > 0) {
    const [user] = existingUser;
  } else {
    return { error: "Email not found!" };
  }

  const [passwordResetToken] = await generatePasswortResetToken(email);

  if (passwordResetToken) {
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  }

  return { success: "Reset email sent!" };
};
