import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type Adapter } from "next-auth/adapters";

import { db } from "./server/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { createTable } from "~/server/db/schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUsers = await getUserById(user.id!);

      if (!existingUsers?.length) return false;

      const existingUser = existingUsers[0];

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token, session });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUserArray = await getUserById(token.sub);
      const existingUser =
        existingUserArray!.length > 0 ? existingUserArray![0] : null;

      if (!existingUser) return token;

      return token;
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  session: { strategy: "jwt" },
  ...authConfig,
});
