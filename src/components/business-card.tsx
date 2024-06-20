import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface BusinessCardProps {
  title: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const BusinessCard = ({
  title,
  name,
  description,
  imageUrl,
}: BusinessCardProps) => {
  return (
    <Card
      className="relative flex min-h-52 cursor-pointer select-none flex-col justify-center bg-cover shadow-lg hover:translate-y-[-4px]"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 rounded-md border border-black bg-white bg-opacity-80 shadow-lg backdrop-blur-sm" />
      <CardHeader className="relative flex flex-col items-center justify-center">
        <CardTitle className="text-3xl text-black">{title}</CardTitle>
        <CardDescription className="flex flex-col items-center">
          <span className="text-lg font-bold text-black">{name}</span>
          <span className="text-md font-medium">{description}</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
