"use server";

import { eq } from "drizzle-orm";
import type * as z from "zod";
import bcrypt from "bcryptjs";

import { getUserByEmail, getUserById, getUserByUserName } from "~/data/user";
import { PasswordUpdateSchema, UserSchema } from "~/schemas";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { getImageByUrl } from "~/server/queries";

export const updateUser = async (
  values: z.infer<typeof UserSchema>,
  userId: string,
) => {
  const validatedFields = UserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { firstName, lastName, userName, email } = validatedFields.data;

  const userNameLower = userName.toLowerCase();

  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const existingUserWithSameEmail = await getUserByEmail(email);

  if (existingUserWithSameEmail && existingUserWithSameEmail.id !== userId) {
    return { error: "Email already exists!" };
  }

  const existingUserWithSameUserName = await getUserByUserName(userName);

  if (
    existingUserWithSameUserName &&
    existingUserWithSameUserName.id !== userId
  ) {
    return { error: "Username already exists!" };
  }
  await db
    .update(users)
    .set({
      firstName,
      lastName,
      userName: userNameLower,
      email,
    })
    .where(eq(users.id, existingUser.id));

  const updatedUser = await getUserById(existingUser.id);

  return { success: "User updated!", user: updatedUser };
};

export const updatePassword = async (
  values: z.infer<typeof PasswordUpdateSchema>,
  userId: string,
) => {
  const validatedFields = PasswordUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    existingUser.password,
  );

  if (!isPasswordCorrect) {
    return { error: "Password is incorrect!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser.id));

  return { success: "Password updated!" };
};

export const deleteUser = async (userId: string) => {
  const existingUser = await getUserById(userId);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  await db.delete(users).where(eq(users.id, existingUser.id));

  return { success: "User deleted!" };
};

export const updateProfileImage = async (userId: string, image: string) => {
  const existingUser = await getUserById(userId);
  const { id } = await getImageByUrl(image);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  await db
    .update(users)
    .set({ image: id })
    .where(eq(users.id, existingUser.id));

  return { success: "Profile image updated!" };
};
