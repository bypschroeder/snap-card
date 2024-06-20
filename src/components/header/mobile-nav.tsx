import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "~/actions/logout";

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="block p-2 md:hidden">
        <span className="text-2xl text-slate-950 dark:text-slate-200">
          <Menu />
        </span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetDescription>
            <div className="flex h-full w-full flex-col gap-4 py-6">
              <SheetTrigger asChild>
                <Link href="/dashboard">
                  <Button
                    variant="link"
                    className="w-full text-lg font-semibold"
                  >
                    Dashboard
                  </Button>
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link href="/profile">
                  <Button
                    variant="link"
                    className="w-full text-lg font-semibold"
                  >
                    Profile
                  </Button>
                </Link>
              </SheetTrigger>
              <div className="h-px w-screen bg-border" />
              <form action={logout}>
                <SheetTrigger asChild>
                  <Button
                    type="submit"
                    variant="link"
                    className="w-full text-lg font-semibold"
                  >
                    Logout
                  </Button>
                </SheetTrigger>
              </form>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
