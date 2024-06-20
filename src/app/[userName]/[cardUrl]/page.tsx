"use client";

import { useEffect, useState } from "react";
import { getCardByUrl } from "~/actions/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getImageById } from "~/server/queries";
import { Card as CardType } from "~/types/card";
import { SocialIcon } from "react-social-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const ShareCardPage = ({
  params,
}: {
  params: { userName: string; cardUrl: string };
}) => {
  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      const url = `http://localhost:3000/${params.userName}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as CardType;
      if (!card) return;
      setCurrentCard(card);
      setCardIsLoading(false);
      if (!card.profileImageId) return;
      const image = await getImageById(card.profileImageId);
      setImageUrl(image!.url);
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

  if (currentCard?.cardVisibility === "private") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-md text-muted-foreground">This card is private.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-xl flex-1 flex-col items-center gap-6 py-4">
      <Avatar className="h-36 w-36 outline outline-2 outline-border">
        <AvatarImage
          className="h-full w-full object-cover"
          src={imageUrl ?? ""}
        />
        <AvatarFallback className="font-bold capitalize tracking-tighter"></AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">
          {currentCard?.firstName} {currentCard?.lastName}
        </h1>
        <span className="text-md text-muted-foreground">
          {currentCard?.profession?.map((prof) => prof.name).join(", ")}
        </span>
      </div>
      <div className="flex flex-wrap gap-4">
        {currentCard?.socialMediaLinks?.map((link) => (
          <SocialIcon key={link.url} url={link.url} className="h-8 w-8" />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {currentCard?.email}</p>
          <p>Phone Number: {currentCard?.phoneNumber}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{currentCard?.bio}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 px-4 ">
            {currentCard?.skills?.map((skill) => (
              <li className="list-disc" key={skill.name}>
                {skill.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareCardPage;
