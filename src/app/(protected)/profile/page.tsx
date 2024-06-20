"use client";

import { useRouter } from "next/navigation";

import useUserStore from "~/store/useUserStore";
import { logout } from "~/actions/logout";
import { deleteUser } from "~/actions/user";

import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ProfileForm } from "~/components/forms/profile-form";

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleDeleteUser = async () => {
    await deleteUser(user!.id);
    await logout();
    router.refresh();
  };
  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <ProfileForm />
      <AlertDialog>
        <AlertDialogTrigger className="w-fit">
          <Button variant={"destructive"}>Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
