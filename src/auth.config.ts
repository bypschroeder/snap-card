import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

import { LoginSchema } from "~/schemas";
import { getUserByEmail } from "~/data/user";

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const userArray = await getUserByEmail(email);
          const user = userArray!.length > 0 ? userArray![0] : null;

          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
