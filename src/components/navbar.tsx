"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Profile } from "./profile";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export const Navbar = () => {
  const router = useRouter()
  const user = false
  return (
    <nav className="fixed z-50 flex h-24 w-full items-center justify-between bg-background/60 backdrop-blur-lg px-4 py-10 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <Link href="/">
        <h1 className="font-heading text-4xl font-semibold cursor-pointer">SnapCard</h1>
      </Link>
      <div className="hidden gap-1 md:gap-2 lg:gap-4 md:flex">
        <Link href="/">
          <Button variant="link" className="font-semibold text-md">Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="link" className="font-semibold text-md">cock</Button>
        </Link>
        <Link href="/">
          <Button variant="link" className="font-semibold text-md">Home</Button>
        </Link>
      </div>

      <UploadButton endpoint="imageUploader" onClientUploadComplete={() => {
        router.refresh()
      }} />
      <div className="items-center hidden gap-2 md:flex">
        {user ? <Profile /> : <>
          <Button variant="ghost" size="lg">Login</Button>
          <Button size="lg">Sign up</Button>
        </>}
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
                      <div className="py-6 flex flex-col gap-4 w-full h-full">
                          <SheetTrigger asChild>
                              <Link href="/">
                                  <Button variant="link" size="lg" className="w-full font-semibold text-lg">
                                      Home
                                  </Button>
                              </Link>
                          </SheetTrigger>
                          <SheetTrigger asChild>
                              <Link href="/about">
                                  <Button variant="link" className="w-full font-semibold text-lg">
                                      About
                                  </Button>
                              </Link>
                          </SheetTrigger>
                          <SheetTrigger asChild>
                              <Link href="/privacy-policy">
                                  <Button variant="link" className="w-full font-semibold text-lg">
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
