import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "~/data/verification-token";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { passwordResetTokens, verificationTokens } from "~/server/db/schema";
import { getPasswordResetTokenByEmail } from "~/data/password-reset-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingTokenArray = await getVerificationTokenByEmail(email);
  const existingToken =
    existingTokenArray!.length > 0 ? existingTokenArray![0] : null;

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const generatePasswortResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken?.id));
  }

  const passwordResetToken = await db.insert(passwordResetTokens).values({
    email,
    token,
    expires
  }).returning()

  return passwordResetToken
};
