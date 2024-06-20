"use client";

import { Globe, Home, Images, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";

const CardDetailsLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { cardUrl: string };
}) => {
  const currentPath = usePathname();
  const basePath = `/dashboard/${params.cardUrl.split("/").pop()}`;

  const getButtonClass = (path: string) =>
    currentPath === path ? "bg-accent text-black" : "";

  return (
    <div className="flex w-full flex-1 py-6">
      <div className="flex w-full max-w-48 flex-col gap-2 p-4">
        <Link href={basePath}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(basePath)}`}
          >
            <Home size={20} />
            <span>Overview</span>
          </Button>
        </Link>
        <Link href={`${basePath}/socials`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/socials`)}`}
          >
            <Globe size={20} />
            <span>Socials</span>
          </Button>
        </Link>
        <Link href={`${basePath}/gallery`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/gallery`)}`}
          >
            <Images size={20} />
            <span>Gallery</span>
          </Button>
        </Link>
        <Link href={`${basePath}/settings`}>
          <Button
            variant={"ghost"}
            className={`flex w-full items-center justify-start gap-2 text-muted-foreground hover:text-black ${getButtonClass(`${basePath}/settings`)}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
      <div className="flex h-full flex-1 flex-col gap-4 p-4">{children}</div>
      <div className="flex w-full max-w-sm flex-1 flex-col gap-2 bg-gray-100 p-4">
        <h1>Preview</h1>
      </div>
    </div>
  );
};

export default CardDetailsLayout;
