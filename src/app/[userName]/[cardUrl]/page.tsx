"use client";

import { useEffect, useState } from "react";
import { getCardByUrl, getCardImages } from "~/actions/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getImageById } from "~/server/queries";
import { Card as CardType } from "~/types/card";
import { SocialIcon } from "react-social-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

const ShareCardPage = ({
  params,
}: {
  params: { userName: string; cardUrl: string };
}) => {
  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchCard = async () => {
      const url = `http://localhost:3000/${params.userName}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as CardType;
      if (!card) return;
      setCurrentCard(card);
      if (card.profileImageId) {
        const image = await getImageById(card.profileImageId);
        setImageUrl(image!.url);
      }
      const cardImages = (await getCardImages(card.id)) as string[];
      if (cardImages.length > 0) {
        setGalleryImages(cardImages);
      }
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

  if (currentCard?.cardVisibility === "private") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-md text-muted-foreground">This card is private.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-xl flex-1 flex-col items-center gap-6 py-4">
      {currentCard.profileImageId && imageUrl && (
        <Avatar className="h-36 w-36 outline outline-2 outline-border">
          <AvatarImage
            className="h-full w-full object-cover"
            src={imageUrl ?? ""}
          />
          <AvatarFallback className="font-bold capitalize tracking-tighter"></AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">
          {currentCard?.firstName} {currentCard?.lastName}
        </h1>
        <span className="text-md text-muted-foreground">
          {currentCard?.profession?.map((prof) => prof.name).join(", ")}
        </span>
      </div>
      {currentCard.socialMediaLinks?.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {currentCard?.socialMediaLinks?.map((link) => (
            <SocialIcon key={link.url} url={link.url} className="h-8 w-8" />
          ))}
        </div>
      )}
      {currentCard.websiteUrl && (
        <a href={currentCard.websiteUrl}>My website</a>
      )}
      {currentCard.email || currentCard.phoneNumber ? (
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            {currentCard.email && <p>Email: {currentCard?.email}</p>}
            {currentCard.phoneNumber && (
              <p>Phone Number: {currentCard?.phoneNumber}</p>
            )}
          </CardContent>
        </Card>
      ) : null}
      {currentCard.bio && (
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{currentCard?.bio}</p>
          </CardContent>
        </Card>
      )}
      {currentCard.skills?.length > 0 && (
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
      )}
      {galleryImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-between gap-2">
            {galleryImages.map((imageUrl, index) => (
              <Dialog key={index}>
                <DialogTrigger className="h-32 w-32 overflow-hidden rounded-md outline outline-2 outline-border">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index}`}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </DialogTrigger>
                <DialogContent className="rounded-md outline outline-border">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index}`}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShareCardPage;
