"use client";

import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User } from "lucide-react";
import { logout } from "~/actions/logout";
import Link from "next/link";
import useUserStore from "~/store/useUserStore";
import { getImageById } from "~/server/queries";

export function Profile() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!user?.image) return;
      const image = await getImageById(user.image);
      if (!image) return;
      setImageUrl(image?.url);
    };

    fetchImage();
  }, [user?.image]);

  const handleLogout = async () => {
    clearUser();
    await logout();
  };
  return (
    <div className="h-10 w-10">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={imageUrl ?? ""}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="font-bold capitalize tracking-tighter">
              {user?.firstName.charAt(0).toUpperCase()}{" "}
              {user?.lastName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p className="text-sm font-semibold leading-none">
              {user ? `${user?.firstName} ${user?.lastName}` : "Undefined Name"}
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
          <DropdownMenuSeparator />
          <form action={handleLogout}>
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
