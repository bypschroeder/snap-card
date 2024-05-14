import { db } from "~/server/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (model, { eq }) => eq(model.token, token),
    });

    return passwordResetToken
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });

    return passwordResetToken
  } catch {
    return null;
  }
};
