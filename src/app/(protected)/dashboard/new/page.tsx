"use client";

import { NewCardForm } from "~/components/forms/new-card-form";

const CreateCardPage = () => {
  return (
    <div className="flex h-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-medium sm:text-3xl">
        Let&apos;s create a new card
      </h1>
      <NewCardForm />
    </div>
  );
};

export default CreateCardPage;
