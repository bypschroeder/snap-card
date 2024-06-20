"use client";

import { CreditCard, Globe, Home, Images, Settings, Share } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import Preview from "~/components/preview";
import useUserStore from "~/store/useUserStore";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

const CardDetailsLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { cardUrl: string };
}) => {
  const currentPath = usePathname();
  const basePath = `/dashboard/${params.cardUrl.split("/").pop()}`;

  const user = useUserStore((state) => state.user);

  const getButtonClass = (path: string) =>
    currentPath === path ? "bg-accent text-black" : "";

  const copyCardUrlToClipboard = () => {
    navigator.clipboard
      .writeText(
        `http://localhost:3000/${user?.userName.toLowerCase()}/${params.cardUrl}`,
      )
      .then(() => {
        console.log("Card URL copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy card URL to clipboard", err);
      });
    toast(
      <div className="flex items-center gap-4">
        <Share size={20} />
        <span className="text-lg">Card URL copied to clipboard</span>
      </div>,
    );
  };

  return (
    <div className="lg:grid-cols-card-details sm:grid-cols-card-details-md grid w-full flex-1 grid-cols-1 gap-4 px-2 py-6">
      <div className="flex w-full justify-between gap-2 p-4 sm:w-40 sm:flex-col sm:justify-start lg:w-48">
        <Link href={basePath}>
          <Button
            variant={"ghost"}
            className={`flex items-center justify-start gap-2 text-muted-foreground hover:text-black sm:w-full ${getButtonClass(basePath)}`}
          >
            <Home size={20} />
            <span className="hidden sm:block">Overview</span>
          </Button>
        </Link>
        <Link href={`${basePath}/socials`}>
          <Button
            variant={"ghost"}
            className={`flex items-center justify-start gap-2 text-muted-foreground hover:text-black sm:w-full ${getButtonClass(`${basePath}/socials`)}`}
          >
            <Globe size={20} />
            <span className="hidden sm:block">Socials</span>
          </Button>
        </Link>
        <Link href={`${basePath}/gallery`}>
          <Button
            variant={"ghost"}
            className={`flex items-center justify-start gap-2 text-muted-foreground hover:text-black sm:w-full ${getButtonClass(`${basePath}/gallery`)}`}
          >
            <Images size={20} />
            <span className="hidden sm:block">Gallery</span>
          </Button>
        </Link>
        <Link href={`${basePath}/settings`}>
          <Button
            variant={"ghost"}
            className={`flex items-center justify-start gap-2 text-muted-foreground hover:text-black sm:w-full ${getButtonClass(`${basePath}/settings`)}`}
          >
            <Settings size={20} />
            <span className="hidden sm:block">Settings</span>
          </Button>
        </Link>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="flex items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-black sm:w-full">
              <CreditCard size={20} />
              <span className="hidden sm:block">Preview</span>
            </SheetTrigger>
            <SheetContent className="w-full max-w-sm">
              <div className="mb-4 flex w-full items-center justify-between">
                <span className="text-lg font-semibold">Preview</span>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="flex items-center gap-2"
                  onClick={copyCardUrlToClipboard}
                >
                  <Share size={20} />
                  <span>Share</span>
                </Button>
              </div>
              <Preview params={params} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-4 p-4">{children}</div>
      <div className="hidden w-full max-w-sm flex-1 flex-col items-center justify-center lg:flex ">
        <div className="mb-4 flex w-full items-center justify-between">
          <span className="text-lg font-semibold">Preview</span>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="flex items-center gap-2"
            onClick={copyCardUrlToClipboard}
          >
            <Share size={20} />
            <span>Share</span>
          </Button>
        </div>
        <Preview params={params} />
      </div>
    </div>
  );
};

export default CardDetailsLayout;
