"use server";

import type * as z from "zod";

import {
  CreateCardSchema,
  UpdateCardOverviewSchema,
  UpdateCardSettingsSchema,
  UpdateCardSocialsSchema,
} from "~/schemas";
import { db } from "~/server/db";
import { card_images, cards } from "~/server/db/schema";
import { getUserById, getUserByUserName } from "~/data/user";
import { and, eq } from "drizzle-orm";
import getUser from "~/lib/getUser";
import { getImageById, getImageByUrl } from "~/server/queries";

export const getAllCards = async () => {
  try {
    const cards = await db.query.cards.findMany({
      orderBy: (model, { desc }) => desc(model.createdAt),
    });

    return cards;
  } catch {
    return null;
  }
};

export const getCards = async (userId: string) => {
  try {
    const cards = await db.query.cards.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
    });

    return cards;
  } catch {
    return null;
  }
};

export const getCardById = async (id: number) => {
  try {
    const card = await db.query.cards.findFirst({
      where: (model, { eq }) => eq(model.id, id),
    });

    return card;
  } catch {
    return null;
  }
};

export const getCardByUrl = async (cardUrl: string) => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  try {
    const card = await db.query.cards.findFirst({
      where: (model, { eq }) =>
        and(eq(model.cardUrl, cardUrl), eq(model.userId, user.id)),
    });

    return card;
  } catch {
    return null;
  }
};

export const getSharedCard = async (cardUrl: string, userName: string) => {
  const user = await getUserByUserName(userName);
  console.log(user);

  if (!user) {
    return null;
  }

  const userId = user?.id;

  try {
    const card = await db.query.cards.findFirst({
      where: (model, { eq }) =>
        and(eq(model.cardUrl, cardUrl), eq(model.userId, userId)),
    });

    return card;
  } catch {
    return null;
  }
};

export const createCard = async (values: z.infer<typeof CreateCardSchema>) => {
  const validatedFields = CreateCardSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed for card creation" };
  }

  const { userId, cardName, cardUrl, cardVisibility } = validatedFields.data;

  const user = await getUserById(userId);

  const existingCardUrl = await getCardByUrl(cardUrl);

  if (existingCardUrl) {
    return { error: "Card URL already exists" };
  }

  if (user) {
    try {
      await db.insert(cards).values({
        userId,
        cardName,
        cardUrl,
        cardVisibility,
        profileImageId: user.image,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: "",
      });
      return { success: "Card created successfully" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create card: ${error.message}`);
      }
    }
  } else {
    throw new Error("User is undefined");
  }

  const lastUrlSegment = cardUrl.split("/").pop();

  if (!lastUrlSegment) {
    return { error: "No card URL provided" };
  }
};

export const updateCardOverview = async (
  values: z.infer<typeof UpdateCardOverviewSchema>,
  cardId: number,
) => {
  const validatedFields = UpdateCardOverviewSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed for card update" };
  }

  const {
    profileImageId,
    firstName,
    lastName,
    bio,
    profession,
    skills,
    email,
    phoneNumber,
  } = validatedFields.data;

  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }
  try {
    await db
      .update(cards)
      .set({
        profileImageId,
        firstName,
        lastName,
        bio,
        profession,
        skills,
        email,
        phoneNumber,
      })
      .where(eq(cards.id, cardId));
    return { success: "Card updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update card: ${error.message}`);
    }
  }
};

export const updateCardSocials = async (
  values: z.infer<typeof UpdateCardSocialsSchema>,
  cardId: number,
) => {
  const validatedFields = UpdateCardSocialsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed for card update" };
  }

  const { socialMediaLinks, websiteUrl } = validatedFields.data;

  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }
  try {
    await db
      .update(cards)
      .set({
        socialMediaLinks,
        websiteUrl,
      })
      .where(eq(cards.id, cardId));
    return { success: "Card updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update card: ${error.message}`);
    }
  }
};

export const updateCardSettings = async (
  values: z.infer<typeof UpdateCardSettingsSchema>,
  cardId: number,
) => {
  const validatedFields = UpdateCardSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Validation failed for card update" };
  }

  const { cardName, cardUrl, cardVisibility } = validatedFields.data;

  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }

  if (cardUrl && cardUrl !== card.cardUrl) {
    const existingCardUrl = await getCardByUrl(cardUrl);

    if (existingCardUrl) {
      return { error: "Card URL already exists" };
    }
  }

  try {
    await db
      .update(cards)
      .set({
        cardName,
        cardUrl,
        cardVisibility,
      })
      .where(eq(cards.id, cardId));
    return { success: "Card updated successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update card: ${error.message}`);
    }
  }
};

export const deleteCard = async (cardId: number) => {
  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }
  try {
    await db.delete(cards).where(eq(cards.id, cardId));
    return { success: "Card deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete card: ${error.message}`);
    }
  }
};

export async function addImageToCard(cardId: number, imageId: number) {
  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }

  try {
    await db.insert(card_images).values({
      imageId,
      cardId,
    });
    return { success: "Image added to card successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to add image to card: ${error.message}`);
    }
  }
}

export async function getCardImages(cardId: number) {
  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }

  try {
    const images = await db.query.card_images.findMany({
      where: (model, { eq }) => eq(model.cardId, cardId),
    });

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageObject = await getImageById(image.imageId);
        return imageObject?.url;
      }),
    );

    return imageUrls.filter((url) => url !== undefined);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get card images: ${error.message}`);
    }
  }
}

export async function deleteCardImage(cardId: number, imageId: number) {
  const card = await getCardById(cardId);

  if (!card) {
    return { error: "Card ID is undefined" };
  }

  try {
    await db.delete(card_images).where(eq(card_images.imageId, imageId));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete card image: ${error.message}`);
    }
  }
}

export const updateCardImage = async (cardId: number, image: string) => {
  const currentCard = await getCardById(cardId);
  const imageData = await getImageByUrl(image);

  if (!currentCard) {
    return { error: "Card does not exist!" };
  }

  if (!imageData) {
    return { error: "Image does not exist!" };
  }

  const { id } = imageData;

  await db
    .update(cards)
    .set({ profileImageId: id })
    .where(eq(cards.id, currentCard.id));

  return { success: "Card image updated!" };
};
