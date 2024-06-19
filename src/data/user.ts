import { db } from "~/server/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByUserName = async (userName: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.userName, userName),
    });

    return user;
  } catch {
    return null;
  }
};
