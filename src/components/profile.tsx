"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
// import useUser from "@/app/hook/useUser";
// import { supabaseBrowser } from "@/lib/supabase/browser";
// import { useQueryClient } from "@tanstack/react-query";
// import { usePathname, useRouter } from "next/navigation";
// import { protectedPaths } from "@/lib/constant";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function Profile() {
	// const { isFetching, data } = useUser();
	// const queryClient = useQueryClient();
	// const router = useRouter();
	//
	// const pathname = usePathname();
	//
	// if (isFetching) {
	// 	return <></>;
	// }
	//
	// const handleLogout = async () => {
	// 	const supabase = supabaseBrowser();
	// 	queryClient.clear();
	// 	await supabase.auth.signOut();
	// 	router.refresh();
	// 	if (protectedPaths.includes(pathname)) {
	// 		router.replace("/auth?next=" + pathname);
	// 	}
	// };
  const data = {
    id: 1,
    image_url: null,
    display_name: 'test',
    email: "cock"
  }

	return (
		<div>
			{!data?.id ? (
				<Link href="/auth" className=" animate-fade">
					<Button variant="outline">SignIn</Button>
				</Link>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="cock" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							Logout
						</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
