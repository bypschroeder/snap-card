"use client";

import { CardSocialsForm } from "~/components/forms/card-socials-form";

const CardSocialsPage = ({ params }: { params: { cardUrl: string } }) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="text-xl font-medium sm:text-2xl">Socials</h1>
      <CardSocialsForm params={params} />
    </div>
  );
};

export default CardSocialsPage;
