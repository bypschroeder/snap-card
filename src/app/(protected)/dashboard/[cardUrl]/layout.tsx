"use client";

import { Globe, Home, Images, Settings, Share } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import Preview from "~/components/preview";
import useUserStore from "~/store/useUserStore";
import { toast } from "sonner";

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
    <div className="flex w-full flex-1 px-2 py-6">
      <div className="flex w-full max-w-48 flex-col gap-2 p-4">
        <Link href={basePath}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(basePath)}`}
          >
            <Home size={20} />
            <span className="hidden sm:block">Overview</span>
          </Button>
        </Link>
        <Link href={`${basePath}/socials`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/socials`)}`}
          >
            <Globe size={20} />
            <span className="hidden sm:block">Socials</span>
          </Button>
        </Link>
        <Link href={`${basePath}/gallery`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/gallery`)}`}
          >
            <Images size={20} />
            <span className="hidden sm:block">Gallery</span>
          </Button>
        </Link>
        <Link href={`${basePath}/settings`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/settings`)}`}
          >
            <Settings size={20} />
            <span className="hidden sm:block">Settings</span>
          </Button>
        </Link>
      </div>
      <div className="flex w-full flex-1 flex-col gap-4 p-4">{children}</div>
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center ">
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
