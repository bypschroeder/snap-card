import { db } from "~/server/db";
import { verificationTokens } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email));

    return verificationToken;
  } catch {
    return null;
  }
};
