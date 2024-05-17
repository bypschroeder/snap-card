"use client"

import type * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { CardSchema } from "~/schemas";
import { createCard } from "~/actions/create-card";

const CreateCardPage = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const mockdata = {
    showEmail: true,
    showPhoneNumber: true,
    websiteUrl: "https://www.melina-seitz-photography.de",
    profession: "Fotograf",
    socialMediaLinks: {
      instagram: "https://www.instagram.com/melina.seitz.photography",
      twitter: null,
      linkedIn: null
    },
    bio: "Hallo ich bin Melina, eine Hobby Fotografin!",
    skills: ["Tier-Fotografie", "Portraits"],
    visibility: "public"
  }

  const form = useForm<z.infer<typeof CardSchema>>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      showEmail: true,
      showPhoneNumber: true,
      websiteUrl: "",
      profession: "",
      socialMediaLinks: {
        instagram: "",
        twitter: "",
        linkedIn: ""
      },
      bio: "",
      skills: [""],
      visibility: "public"
    },
  });

  const onSubmit = (values: z.infer<typeof CardSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      await createCard(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <div className="flex h-full justify-center items-center">
      <h1>CreateCardPage</h1>
    </div>
  )
}

export default CreateCardPage
