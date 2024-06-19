import React from "react";
import useUserStore from "../store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UploadButton } from "./upload-profile-image";

export const ProfileImage = () => {
  const user = useUserStore((state) => state.user);
  return (
    <Avatar className="h-20 w-20">
      <AvatarImage src={user?.image ?? ""} />
      <AvatarFallback className="font-bold capitalize tracking-tighter">
        <UploadButton />
      </AvatarFallback>
    </Avatar>
  );
};
