import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "~/data/verification-token";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { verificationTokens } from "~/server/db/schema";

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

  const verificationToken = await db.insert(verificationTokens).values({
    email,
    token,
    expires
  })

  return verificationToken
};
