"use client";

import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import useUserStore from "~/store/useUserStore";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { UpdateCardOverviewSchema } from "~/schemas";
import { getCardByUrl, updateCardOverview } from "~/actions/card";
import { Button } from "~/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Card } from "~/types/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { UploadButton } from "~/components/upload-profile-image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UploadSVG } from "~/components/upload-svg";
import { getImageById } from "~/server/queries";
import { updateCardImage } from "~/actions/card";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { LoadingButton } from "~/components/loading-button";

export const CardOverviewForm = ({
  params,
}: {
  params: { cardUrl: string };
}) => {
  const user = useUserStore((state) => state.user);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showButtons, setShowButtons] = useState(false);

  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      if (!user) return;
      const url = `http://localhost:3000/${user?.userName.toLowerCase()}/${params.cardUrl}`;
      const card = (await getCardByUrl(url)) as Card;
      if (!card) return;
      setCurrentCard(card);
      setCardIsLoading(false);
    };
    fetchCard();
  }, [user]);

  const defaultFormValues: z.infer<typeof UpdateCardOverviewSchema> = {
    profileImageId: null,
    firstName: "",
    lastName: "",
    bio: "",
    profession: [
      {
        name: "",
      },
    ],
    skills: [
      {
        name: "",
      },
    ],
    email: "",
    phoneNumber: "",
  };

  const form = useForm<z.infer<typeof UpdateCardOverviewSchema>>({
    resolver: zodResolver(UpdateCardOverviewSchema),
    defaultValues: !cardIsLoading
      ? {
          ...defaultFormValues,
          profileImageId: currentCard!.profileImageId,
          firstName: currentCard!.firstName as string,
          lastName: currentCard!.lastName as string,
          bio: currentCard!.bio,
          profession: currentCard!.profession ?? [{ name: "" }],
          skills: currentCard!.skills ?? [{ name: "" }],
          email: currentCard!.email,
          phoneNumber: currentCard!.phoneNumber,
        }
      : defaultFormValues,
  });

  useEffect(() => {
    if (user && currentCard) {
      form.reset({
        profileImageId: currentCard.profileImageId,
        firstName: currentCard.firstName as string,
        lastName: currentCard.lastName as string,
        bio: currentCard.bio,
        profession: currentCard.profession ?? [{ name: "" }],
        skills: currentCard.skills ?? [{ name: "" }],
        email: currentCard.email,
        phoneNumber: currentCard.phoneNumber,
      });
    }
  }, [user, currentCard, form]);

  const watchFields = useWatch({ control: form.control });

  useEffect(() => {
    const defaultValues = form.formState.defaultValues as z.infer<
      typeof UpdateCardOverviewSchema
    >;
    const deepEqual = (obj1: any, obj2: any): boolean => {
      if (obj1 === obj2) return true;

      if (
        typeof obj1 !== "object" ||
        typeof obj2 !== "object" ||
        obj1 === null ||
        obj2 === null
      ) {
        return false;
      }

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (const key of keys1) {
        if (!deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }

      return true;
    };

    const isChanged = !deepEqual(watchFields, defaultValues);

    setShowButtons(isChanged);
  }, [watchFields, form.formState.defaultValues]);

  const {
    fields: professionFields,
    append: appendProfession,
    remove: removeProfession,
  } = useFieldArray({
    control: form.control,
    name: "profession",
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const handleAddProfessionInput = () => {
    appendProfession({ name: "" });
  };

  const handleDeleteProfessionInput = (index: number) => {
    if (professionFields.length > 1) {
      removeProfession(index);
    }
  };

  const handleAddSkillInput = () => {
    appendSkill({ name: "" });
  };

  const handleDeleteSkillInput = (index: number) => {
    if (skillsFields.length > 1) {
      removeSkill(index);
    }
  };

  const onSubmit = (values: z.infer<typeof UpdateCardOverviewSchema>) => {
    setError("");
    setSuccess("");
    console.log(values);

    if (!user) {
      throw new Error("User is undefined");
    }

    startTransition(async () => {
      await updateCardOverview(values, currentCard!.id).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        setShowButtons(false);
      });
    });
  };

  const handleUserCancel = () => {
    form.reset(form.formState.defaultValues);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!currentCard?.profileImageId) return;
      const image = await getImageById(currentCard.profileImageId);
      if (!image) return;
      setImageUrl(image?.url);
    };

    fetchImage();
  }, [currentCard?.profileImageId]);

  const handleCardImageUpload = async (res: any) => {
    updateCardImage(currentCard!.id, res[0].url);
  };

  if (cardIsLoading || !currentCard) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinnerSVG width={48} height={48} />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormLabel>Profile Image</FormLabel>
        <UploadButton onUploadComplete={handleCardImageUpload}>
          <Avatar className="h-28 w-28 outline outline-2 outline-border">
            <AvatarImage
              className="h-full w-full object-cover"
              src={imageUrl ?? ""}
            />
            <AvatarFallback className="font-bold capitalize tracking-tighter">
              <UploadSVG />
            </AvatarFallback>
          </Avatar>
        </UploadButton>
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="First Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Last Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={isPending}
                  placeholder="Bio"
                  className="h-24 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full gap-4">
          <div className="flex w-full flex-col gap-2">
            <FormLabel>Profession</FormLabel>
            {professionFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`profession.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex w-full items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          placeholder="Photographer"
                        />
                      </FormControl>
                      {index > 0 && (
                        <Button
                          type="button"
                          className="w-11"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => handleDeleteProfessionInput(index)}
                        >
                          <Trash size={20} />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {professionFields.length < 3 && (
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={handleAddProfessionInput}
              >
                <Plus size={20} />
              </Button>
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <FormLabel>Skills</FormLabel>
            {skillsFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex w-full items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          disabled={isPending}
                          placeholder="3D Modelling"
                        />
                      </FormControl>
                      {index > 0 && (
                        <Button
                          type="button"
                          className="w-11"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => handleDeleteSkillInput(index)}
                        >
                          <Trash size={20} />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {skillsFields.length < 3 && (
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={handleAddSkillInput}
              >
                <Plus size={20} />
              </Button>
            )}
          </div>
        </div>
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="email@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="1234567890"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {showButtons && (
          <div className="flex w-full items-end justify-end gap-4">
            <LoadingButton loading={isPending} type="submit">
              Save
            </LoadingButton>
            <Button
              type="button"
              variant={"secondary"}
              onClick={handleUserCancel}
            >
              Cancel
            </Button>
          </div>
        )}
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  );
};
