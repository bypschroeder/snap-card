import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface BusinessCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export const BusinessCard = ({
  title,
  description,
  imageUrl,
}: BusinessCardProps) => {
  return (
    <Card
      className="relative flex min-h-52 cursor-pointer select-none flex-col justify-center bg-cover bg-center shadow-lg hover:translate-y-[-4px]"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 rounded-md border border-black bg-white bg-opacity-70 shadow-lg backdrop-blur-sm" />
      <CardHeader className="relative flex flex-col items-center justify-center">
        <CardTitle className="text-black">{title}</CardTitle>
        <CardDescription className="text-md text-black/75">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
