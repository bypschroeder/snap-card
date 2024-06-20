"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCardByUrl, getCardImages, deleteCardImage } from "~/actions/card"; // Assuming you have a deleteCardImage function
import { FileUploaderForm } from "~/components/forms/file-uploader-form";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
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
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { getImageByUrl } from "~/server/queries";
import useUserStore from "~/store/useUserStore";
import { Card as CardType } from "~/types/card";

const CardGalleryPage = ({ params }: { params: { cardUrl: string } }) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const [cardImagesLoading, setCardImagesLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      const url = `http://localhost:3000/${user?.userName.toLowerCase()}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as CardType;
      if (!card) return;
      setCurrentCard(card);
      setCardIsLoading(false);
    };
    fetchCard();
  }, [user, params.cardUrl]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!currentCard) return;
      const images = (await getCardImages(currentCard?.id)) as string[];
      setCardImages(images);
      setCardImagesLoading(false);
    };
    fetchImages();
  }, [currentCard]);

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      if (!currentCard) return;
      const image = await getImageByUrl(imageUrl);
      const imageId = image?.id;
      if (!imageId) return;
      await deleteCardImage(currentCard?.id, imageId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  if (cardIsLoading || !currentCard) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinnerSVG width={48} height={48} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="text-xl font-medium sm:text-2xl">Gallery</h1>
      <FileUploaderForm
        cardId={currentCard.id}
        uploadedImages={cardImages.length}
        disabled={cardImages.length >= 10}
      />
      {cardImagesLoading ? (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <LoadingSpinnerSVG width={48} height={48} />
        </div>
      ) : (
        <Card className="flex w-full flex-col gap-4">
          <CardTitle className="pl-6 pt-6 text-xl font-medium">
            Uploaded Images
          </CardTitle>
          <CardContent>
            {cardImages.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {cardImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <AlertDialog>
                      <AlertDialogTrigger className="absolute right-0 top-0 p-1">
                        <Button
                          variant={"destructive"}
                          size={"icon"}
                          className="h-6 w-6"
                        >
                          <X />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the image and remove it from the card.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteImage(imageUrl)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="h-32 w-32 overflow-hidden rounded-md outline outline-2 outline-border">
                      <Image
                        src={imageUrl}
                        alt={`Image ${index}`}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover "
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-gray-600">No images uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CardGalleryPage;
