import "server-only";
import { db } from "./db";
import { auth } from "~/auth";

export async function getMyImages() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, user?.id),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return images;
}
