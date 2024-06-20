import Link from "next/link";
import { Button } from "../ui/button";
import { Profile } from "./profile";
import { MobileNav } from "./mobile-nav";
import { auth } from "~/auth";

export const Header = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <Link href="/">
          <h1 className="cursor-pointer font-heading text-4xl font-semibold">
            SnapCard
          </h1>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="link" className="text-sm font-semibold">
                  Dashboard
                </Button>
              </Link>
              <Profile />
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </nav>
      <div className="h-px w-screen bg-border" />
    </header>
  );
};
