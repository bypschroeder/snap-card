"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "~/components/business-card";
import { Button } from "~/components/ui/button";
import useUserStore from "~/store/useUserStore";
import { getCards } from "~/actions/card";
import { Card } from "~/types/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { getImageById } from "~/server/queries";

const DashboardPage = () => {
  const user = useUserStore((state) => state.user);
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardImages, setCardImages] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchCards = async () => {
      try {
        const cards = await getCards(user.id);
        setCards(cards ?? []);
        const imageIds = cards?.map((card) => card.profileImageId) ?? [];
        const images = await Promise.all(
          imageIds
            .filter((id): id is number => id !== null) // Type guard to filter out null values
            .map((id) => getImageById(id)),
        );
        const imageUrls = images?.map((image) => image?.url) as string[];
        setCardImages(imageUrls);
        console.log(imageUrls);
        setCardsLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch cards: ${error.message}`);
        }
      }
    };

    fetchCards();
  }, [user]);

  if (cardsLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinnerSVG width={48} height={48} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col py-6">
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between gap-4 px-6">
          <h1 className="text-3xl font-semibold">Your Cards</h1>
          <Link href="/dashboard/new">
            <Button className="flex gap-2">
              <Plus size={20} />
              <span className="hidden md:inline">Create a new card</span>
            </Button>
          </Link>
        </div>
      </div>
      {cards.length < 1 && (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <p className="text-md text-muted-foreground">
            You don't have any cards yet
          </p>
        </div>
      )}
      <ul className="flex w-full flex-wrap items-center justify-between gap-4 overflow-auto p-6">
        {cards.map((card, index) => (
          <li key={card.id} className="col-span-1 w-full max-w-sm">
            <Link href={`/dashboard/${card.cardUrl.split("/").pop()}`}>
              <BusinessCard
                title={card.cardName}
                description={
                  card.profession
                    ? card.profession.map((prof) => prof.name).join(", ")
                    : "No description"
                }
                name={`${card.firstName} ${card.lastName}`}
                imageUrl={cardImages[index] ?? ""}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
