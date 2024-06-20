import NextAuth from "next-auth";

import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiUploadPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { NextAuthRequest } from "node_modules/next-auth/lib";
import { getAllCards } from "./actions/card";

const { auth } = NextAuth(authConfig);

export default auth(async (req: NextAuthRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const cards = await getAllCards();
  const cardUrls = cards?.map(
    (card) => `/${card.cardUrl.split("/")[3]}/${card.cardUrl.split("/")[4]}`,
  );

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiUploadRoute = nextUrl.pathname.startsWith(apiUploadPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isCardUrl = cardUrls?.includes(nextUrl.pathname);

  if (isApiAuthRoute || isApiUploadRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute && !isCardUrl) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
