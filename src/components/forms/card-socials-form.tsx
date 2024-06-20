"use client";

import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { UpdateCardSocialsSchema } from "~/schemas";
import { Button } from "~/components/ui/button";
import { Plus, Trash } from "lucide-react";
import useUserStore from "~/store/useUserStore";
import { Card } from "~/types/card";
import { getCardByUrl, updateCardSocials } from "~/actions/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { LoadingButton } from "~/components/loading-button";
import { useRouter } from "next/navigation";

export const CardSocialsForm = ({
  params,
}: {
  params: { cardUrl: string };
}) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showButtons, setShowButtons] = useState(false);

  const [cardIsLoading, setCardIsLoading] = useState(true);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

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

  const defaultFormValues: z.infer<typeof UpdateCardSocialsSchema> = {
    socialMediaLinks: [],
    websiteUrl: "",
  };

  const form = useForm<z.infer<typeof UpdateCardSocialsSchema>>({
    resolver: zodResolver(UpdateCardSocialsSchema),
    defaultValues: !cardIsLoading
      ? {
          ...defaultFormValues,
          socialMediaLinks: currentCard!.socialMediaLinks || [],
          websiteUrl: currentCard!.websiteUrl || "",
        }
      : defaultFormValues,
  });

  useEffect(() => {
    if (user && currentCard) {
      form.reset({
        socialMediaLinks: currentCard.socialMediaLinks || [],
        websiteUrl: currentCard.websiteUrl || null,
      });
    }
  }, [user, currentCard, form]);

  const watchFields = useWatch({ control: form.control });

  useEffect(() => {
    const defaultValues = form.formState.defaultValues as z.infer<
      typeof UpdateCardSocialsSchema
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMediaLinks",
  });

  const handleAddInput = () => {
    append({ url: "" });
  };

  const handleDeleteInput = (index: number) => {
    remove(index);
  };

  const onSubmit = (values: z.infer<typeof UpdateCardSocialsSchema>) => {
    setError("");
    setSuccess("");

    const transformedValues = {
      ...values,
      websiteUrl: values.websiteUrl === "" ? null : values.websiteUrl,
    };

    startTransition(async () => {
      await updateCardSocials(transformedValues, currentCard!.id).then(
        (data) => {
          setError(data?.error);
          setSuccess(data?.success);
          setShowButtons(false);
        },
        router.refresh(),
      );
    });
  };

  const handleUserCancel = () => {
    form.reset(form.formState.defaultValues);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex w-full flex-col gap-2">
          <FormLabel>Social Media Links</FormLabel>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`socialMediaLinks.${index}.url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex w-full items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        disabled={isPending}
                        placeholder="https://www.instagram.com/username"
                        type="url"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      className="w-11"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleDeleteInput(index)}
                    >
                      <Trash size={20} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {fields.length < 8 && (
            <Button
              type="button"
              variant={"ghost"}
              size={"icon"}
              onClick={handleAddInput}
            >
              <Plus size={20} />
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  disabled={isPending}
                  placeholder="https://www.example.com"
                  type="url"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
