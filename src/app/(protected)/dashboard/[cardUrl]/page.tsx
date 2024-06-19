"use client";

import { CardOverviewForm } from "~/components/forms/card-overview-form";

const CardOverviewPage = ({ params }: { params: { cardUrl: string } }) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="text-xl font-medium sm:text-2xl">Overview</h1>
      <CardOverviewForm params={params} />
    </div>
  );
};

export default CardOverviewPage;
