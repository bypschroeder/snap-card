"use server";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { getUserByEmail } from "~/data/user";
import { getVerificationTokenByToken } from "~/data/verification-token";
import { users, verificationTokens } from "~/server/db/schema";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (existingToken && existingToken.length > 0) {
    const [currentToken] = existingToken;

    if (!currentToken) {
      return { error: "Token does not exist" };
    }

    const hasExpired = new Date(currentToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(currentToken.email);

    if (existingUser && existingUser.length > 0) {
      const [user] = existingUser;

      if (!user) {
        return { error: "Email does not exist" };
      }

      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          email: currentToken.email,
        })
        .where(eq(users.id, user.id));
    }

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, currentToken.id));
  }

  return { success: "Email verified" };
};
