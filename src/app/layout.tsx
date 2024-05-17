import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import {
  Montserrat as FontSans,
  Playfair_Display as FontSerif,
} from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "~/app/api/uploadthing/core";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "SnapCard",
  description: "Create your digital business card with SnapCard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-screen w-screen bg-background font-sans text-foreground antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full w-full flex-col">
            <Header />
            <main className="mx-auto flex h-full max-w-7xl flex-1 flex-col items-center">
              {children}
            </main>
            <Footer />
            <div id="modal-root" />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
