"use client";

import { useEffect, useState } from "react";
import { getCardByUrl, getCardImages, getSharedCard } from "~/actions/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { getImageById } from "~/server/queries";
import { Card as CardType } from "~/types/card";
import { SocialIcon } from "react-social-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Mail, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "sonner";

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
      const card = (await getSharedCard(url, params.userName)) as CardType;
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

  const handleCopyEmailToClipboard = () => {
    if (currentCard?.email) {
      navigator.clipboard
        .writeText(currentCard.email)
        .then(() => {
          console.log("Email copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy email to clipboard", err);
        });
      toast(
        <div className="flex items-center gap-4">
          <Mail />
          <span className="text-lg">Email copied to clipboard</span>
        </div>,
      );
    }
  };

  const handleCopyPhoneNumberToClipboard = () => {
    if (currentCard?.phoneNumber) {
      navigator.clipboard
        .writeText(currentCard.phoneNumber)
        .then(() => {
          console.log("Phone number copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy phone number to clipboard", err);
        });
      toast(
        <div className="flex items-center gap-4">
          <Phone />
          <span className="text-lg">Phone number copied to clipboard</span>
        </div>,
      );
    }
  };

  if (cardIsLoading || !currentCard) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinnerSVG width={48} height={48} />
      </div>
    );
  }

  if (currentCard?.cardVisibility === "private") {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <p className="text-md text-muted-foreground">This card is private.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-w-2xl flex-1 flex-col items-center gap-6 p-4">
      {currentCard.profileImageId && imageUrl && (
        <Avatar className="h-36 w-36 outline outline-2 outline-border">
          <AvatarImage
            className="h-full w-full object-cover"
            src={imageUrl ?? ""}
          />
        </Avatar>
      )}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">
          {currentCard?.firstName} {currentCard?.lastName}
        </h1>
        {currentCard.profession &&
          currentCard.profession?.length > 0 &&
          currentCard.profession[0]!.name !== "" && (
            <span className="text-md text-muted-foreground">
              {currentCard?.profession?.map((prof) => prof.name).join(", ")}
            </span>
          )}
        <div className="flex gap-2">
          {currentCard.email && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={handleCopyEmailToClipboard}
                  >
                    <Mail />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col items-center gap-1">
                  <span>Click to copy the Email</span>
                  <span className="font-bold">{currentCard?.email}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {currentCard.phoneNumber && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={handleCopyPhoneNumberToClipboard}
                  >
                    <Phone />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col items-center gap-1">
                  <span>Click to copy the Phone Number</span>
                  <span className="font-bold">{currentCard?.phoneNumber}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {currentCard.socialMediaLinks &&
        currentCard.socialMediaLinks?.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {currentCard?.socialMediaLinks?.map((link) => (
              <SocialIcon
                key={link.url}
                url={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8"
              />
            ))}
            {currentCard.websiteUrl && (
              <SocialIcon
                url={currentCard.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8"
              />
            )}
          </div>
        )}
      {currentCard.bio && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{currentCard?.bio}</p>
          </CardContent>
        </Card>
      )}
      {currentCard.skills &&
        currentCard.skills?.length > 0 &&
        currentCard.skills[0]!.name !== "" && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {currentCard?.skills?.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-block rounded-md bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700"
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
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-between gap-4">
            {galleryImages.map((imageUrl, index) => (
              <Dialog key={index}>
                <DialogTrigger className="h-32 w-32 overflow-hidden rounded-md outline outline-2 outline-border sm:h-36 sm:w-36 md:h-44 md:w-44">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index}`}
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                </DialogTrigger>
                <DialogContent className="rounded-md outline outline-border">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index}`}
                    className="h-full w-full object-cover"
                    width={1280}
                    height={1280}
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
