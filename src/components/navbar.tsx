import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Profile } from "./profile";
import { SimpleUploadButton } from "./simple-upload-button";

export const Navbar = () => {
  const user = false;
  return (
    <nav className="fixed z-50 flex h-24 w-full items-center justify-between bg-background/60 px-4 py-10 backdrop-blur-lg md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <Link href="/">
        <h1 className="cursor-pointer font-heading text-4xl font-semibold">
          SnapCard
        </h1>
      </Link>
      <div className="hidden gap-1 md:flex md:gap-2 lg:gap-4">
        <Link href="/">
          <Button variant="link" className="text-md font-semibold">
            Dashboard
          </Button>
        </Link>
        <Link href="/">
          <Button variant="link" className="text-md font-semibold">
            Link
          </Button>
        </Link>
        <Link href="/">
          <Button variant="link" className="text-md font-semibold">
            Home
          </Button>
        </Link>
      </div>
      <SimpleUploadButton />
      <div className="hidden items-center gap-2 md:flex">
        {user ? (
          <Profile />
        ) : (
          <>
            <Button variant="ghost" size="lg">
              Login
            </Button>
            <Button size="lg">Sign up</Button>
          </>
        )}
      </div>
      {/* MOBILE NAV */}
      <Sheet>
        <SheetTrigger className="block p-3 md:hidden">
          <span className="text-2xl text-slate-950 dark:text-slate-200">
            <Menu />
          </span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <div className="flex h-full w-full flex-col gap-4 py-6">
                <SheetTrigger asChild>
                  <Link href="/">
                    <Button
                      variant="link"
                      size="lg"
                      className="w-full text-lg font-semibold"
                    >
                      Home
                    </Button>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link href="/about">
                    <Button
                      variant="link"
                      className="w-full text-lg font-semibold"
                    >
                      About
                    </Button>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link href="/privacy-policy">
                    <Button
                      variant="link"
                      className="w-full text-lg font-semibold"
                    >
                      Privacy Policy
                    </Button>
                  </Link>
                </SheetTrigger>
                <ModeToggle />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
