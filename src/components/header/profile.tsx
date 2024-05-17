import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { auth } from "~/auth";
import { logout } from "~/actions/logout";
import Link from "next/link";

export async function Profile() {
  const session = await auth();
  const user = session?.user;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback className="font-bold capitalize">
              {user!.name!.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p className="text-sm font-semibold leading-none">
              {user?.name ?? "Undefined Name"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email ?? "Undefined Email"}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <form action={logout}>
            <DropdownMenuItem>
              <button type="submit" className="flex w-full items-center gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
