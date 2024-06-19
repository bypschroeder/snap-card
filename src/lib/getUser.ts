import { auth } from "~/auth";
import { getUserById } from "~/data/user";

export default async function getUser() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const user = await getUserById(session?.user?.id);

    return user;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}
