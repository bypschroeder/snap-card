import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length) {
      return user;
    }
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));
    if (user.length) {
      return user;
    }
  } catch {
    return null;
  }
};
