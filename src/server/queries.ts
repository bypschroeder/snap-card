// import "server-only";
"use server";
import { db } from "./db";
import getUser from "~/lib/getUser";

export async function getMyImages() {
  const user = await getUser();

  if (!user?.id) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return images;
}

export async function getImageByUrl(url: string) {
  const images = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.url, url),
  });

  return images;
}

export async function getImageById(id: number) {
  const images = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  return images;
}
