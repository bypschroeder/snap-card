"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "~/components/business-card";
import { Button } from "~/components/ui/button";
import useUserStore from "~/store/useUserStore";
import { getCards } from "~/actions/card";
import { Card } from "~/types/card";

const DashboardPage = () => {
  const user = useUserStore((state) => state.user);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchCards = async () => {
      try {
        const cards = await getCards(user.id);
        setCards(cards ?? []);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch cards: ${error.message}`);
        }
      }
    };

    fetchCards();
  }, [user]);

  return (
    <div className="flex w-full flex-col py-6">
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
      <ul className="flex w-full flex-wrap items-center justify-between gap-4 overflow-auto p-6">
        {cards.map((card) => (
          <li key={card.id} className="col-span-1 w-full max-w-sm">
            <Link href={`/dashboard/${card.cardUrl.split("/").pop()}`}>
              <BusinessCard
                title={card.cardName}
                description={
                  card.profession
                    ? card.profession.map((prof) => prof.name).join(", ")
                    : "No description"
                }
                imageUrl={card.cardUrl}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
