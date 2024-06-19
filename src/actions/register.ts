"use server";

import { RegisterSchema } from "~/schemas";
import type * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getUserByEmail, getUserByUserName } from "~/data/user";
import { generateVerificationToken } from "~/lib/token";
import { sendVerificationEmail } from "~/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userName, firstName, lastName, email, password } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUserWithSameEmail = await getUserByEmail(email);

  if (existingUserWithSameEmail) {
    return { error: "Email already exists!" };
  }

  const existingUserWithSameUserName = await getUserByUserName(userName);

  if (existingUserWithSameUserName) {
    return { error: "Username already exists!" };
  }

  await db.insert(users).values({
    userName,
    firstName,
    lastName,
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
