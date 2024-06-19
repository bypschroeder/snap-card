"use client";

import { useEffect, useState } from "react";
import { getCardByUrl } from "~/actions/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { Card } from "~/types/card";

const ShareCardPage = ({
  params,
}: {
  params: { userName: string; cardUrl: string };
}) => {
  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      const url = `http://localhost:3000/${params.userName}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as Card;
      if (!card) return;
      setCurrentCard(card);
      setCardIsLoading(false);
    };
    fetchCard();
  }, []);

  if (cardIsLoading || !currentCard) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinnerSVG width={48} height={48} />
      </div>
    );
  }

  return (
    <div>
      <p>{currentCard?.cardName}</p>
    </div>
  );
};

export default ShareCardPage;
