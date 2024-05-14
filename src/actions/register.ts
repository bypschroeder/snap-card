"use server";

import { RegisterSchema } from "~/schemas";
import type * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getUserByEmail } from "~/data/user";
import { generateVerificationToken } from "~/lib/token";
import { sendVerificationEmail } from "~/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists!" };
  }

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  const [verificationToken] = await generateVerificationToken(email);

  if (verificationToken) {
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
  }

  return { success: "Confirmation email sent!" };
};
