"use client";

import { Button } from "~/components/ui/button";
import { deleteCard, getCardByUrl } from "~/actions/card";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { CardSettingsForm } from "~/components/forms/card-settings-form";
import { useEffect, useState } from "react";
import { Card } from "~/types/card";
import useUserStore from "~/store/useUserStore";

const CardSettingsPage = ({ params }: { params: { cardUrl: string } }) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      const url = `http://localhost:3000/${user?.userName.toLowerCase()}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as Card;
      if (!card) return;
      setCurrentCard(card);
      setCardIsLoading(false);
    };
    fetchCard();
  }, [user]);

  const handleDeleteCard = async () => {
    await deleteCard(currentCard!.id);
    router.push("/dashboard");
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="text-xl font-medium sm:text-2xl">Settings</h1>
      <CardSettingsForm params={params} />
      {!cardIsLoading && (
        <AlertDialog>
          <AlertDialogTrigger className="w-fit">
            <Button variant={"destructive"}>Delete Card</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                card and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCard}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default CardSettingsPage;
