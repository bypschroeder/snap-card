"use server";

import type * as z from "zod";
import { auth } from "~/auth";

import { CardSchema } from "~/schemas";
import { db } from "~/server/db";
import { cards } from "~/server/db/schema";

export const createCard = async (values: z.infer<typeof CardSchema>) => {
  const validatedFields = CardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed for card creation" };
  }

  const {
    showEmail,
    showPhoneNumber,
    websiteUrl,
    profession,
    socialMediaLinks,
    bio,
    skills,
    visibility,
  } = validatedFields.data;

  const session = await auth();
  const userId = session?.user?.id;

  if (userId) {
    try {
      await db.insert(cards).values({
        userId,
        showEmail,
        showPhoneNumber,
        websiteUrl,
        profession,
        socialMediaLinks,
        bio,
        skills,
        visibility,
      });
    } catch (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }
  } else {
    throw new Error("User ID is undefined");
  }

  return { success: "Card successfully created! " };
};
