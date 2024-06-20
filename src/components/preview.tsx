"use client";

import { useEffect, useState } from "react";
import { Card as CardType } from "~/types/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getCardByUrl, getCardImages } from "~/actions/card";
import { getImageById } from "~/server/queries";
import useUserStore from "~/store/useUserStore";
import { LoadingSpinnerSVG } from "./loading-spinner";
import { Button } from "./ui/button";
import { Mail, Phone } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Image from "next/image";

const Preview = ({ params }: { params: { cardUrl: string } }) => {
  const user = useUserStore((state) => state.user);

  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      const url = `http://localhost:3000/${user?.userName.toLowerCase()}/${params.cardUrl}`;
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
  }, [user]);

  if (cardIsLoading || !currentCard) {
    return (
      <div className="flex h-full max-w-sm flex-1 items-center justify-center">
        <LoadingSpinnerSVG width={32} height={32} />
      </div>
    );
  }
  return (
    <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-2 rounded-md bg-slate-50 p-4 outline outline-border">
      {currentCard.profileImageId && imageUrl && (
        <Avatar className="h-16 w-16 outline outline-1 outline-border">
          <AvatarImage
            className="h-full w-full object-cover"
            src={imageUrl ?? ""}
          />
        </Avatar>
      )}
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-md font-semibold">
          {currentCard?.firstName} {currentCard?.lastName}
        </h1>
        {currentCard.profession &&
          currentCard?.profession?.length > 0 &&
          currentCard.profession[0]!.name !== "" && (
            <span className="text-sm text-muted-foreground">
              {currentCard?.profession?.map((prof) => prof.name).join(", ")}
            </span>
          )}
        <div className="flex gap-2">
          {currentCard.email && (
            <Button className="h-8 w-8" variant={"outline"} size={"icon"}>
              <Mail size={20} />
            </Button>
          )}
          {currentCard.phoneNumber && (
            <Button className="h-8 w-8" variant={"outline"} size={"icon"}>
              <Phone size={20} />
            </Button>
          )}
        </div>
      </div>
      {currentCard.socialMediaLinks &&
        currentCard.socialMediaLinks?.length > 0 && (
          <div className="flex w-full flex-wrap justify-center gap-4">
            {currentCard?.socialMediaLinks?.map((link) => (
              <SocialIcon
                key={link.url}
                url={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: "3rem", width: "3rem" }}
              />
            ))}
            {currentCard.websiteUrl && (
              <SocialIcon
                url={currentCard.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ height: "3rem", width: "3rem" }}
              />
            )}
          </div>
        )}
      {currentCard.bio && (
        <Card className="w-full">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-md font-semibold">Bio</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <p className="line-clamp-6 whitespace-pre-wrap text-sm">
              {currentCard?.bio}
            </p>
          </CardContent>
        </Card>
      )}
      {currentCard.skills &&
        currentCard.skills?.length > 0 &&
        currentCard.skills[0]!.name !== "" && (
          <Card className="w-full">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md font-semibold">My Skills</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="grid grid-cols-2 gap-2">
                {currentCard?.skills?.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-block rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      {galleryImages.length > 0 && (
        <Card className="w-full">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-md font-semibold">Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-between gap-2 px-4">
            {galleryImages.map((imageUrl, index) => (
              <div className="h-20 w-20 overflow-hidden rounded-md outline outline-1 outline-border">
                <Image
                  src={imageUrl}
                  alt={`Image ${index}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Preview;
