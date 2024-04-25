import { TriangleAlert } from "lucide-react";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <TriangleAlert size="32" className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
