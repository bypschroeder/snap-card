"use client";

import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { UpdateCardSettingsSchema } from "~/schemas";
import { Input } from "~/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getCardByUrl, updateCardSettings } from "~/actions/card";
import useUserStore from "~/store/useUserStore";
import { Card } from "~/types/card";
import { LoadingSpinnerSVG } from "~/components/loading-spinner";
import { LoadingButton } from "~/components/loading-button";
import { FormSuccess } from "~/components/form-success";
import { FormError } from "~/components/form-error";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const CardSettingsForm = ({
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

  const defaultFormValues: z.infer<typeof UpdateCardSettingsSchema> = {
    cardName: "",
    cardUrl: "",
    cardVisibility: "public",
  };

  const form = useForm<z.infer<typeof UpdateCardSettingsSchema>>({
    resolver: zodResolver(UpdateCardSettingsSchema),
    defaultValues: !cardIsLoading
      ? {
          ...defaultFormValues,
          cardName: currentCard!.cardName,
          cardUrl: currentCard!.cardUrl.split("/")[4],
          cardVisibility: currentCard!.cardVisibility,
        }
      : defaultFormValues,
  });

  useEffect(() => {
    if (user && currentCard) {
      form.reset({
        cardName: currentCard.cardName,
        cardUrl: currentCard.cardUrl.split("/")[4],
        cardVisibility: currentCard.cardVisibility,
      });
    }
  }, [user, currentCard, form]);

  const watchFields = useWatch({ control: form.control });

  useEffect(() => {
    const defaultValues = form.formState.defaultValues as z.infer<
      typeof UpdateCardSettingsSchema
    >;

    const hasChanged = (
      key: keyof z.infer<typeof UpdateCardSettingsSchema>,
    ) => {
      return watchFields[key] !== defaultValues[key];
    };

    const isChanged = Object.keys(defaultValues).some((key) =>
      hasChanged(key as keyof z.infer<typeof UpdateCardSettingsSchema>),
    );

    setShowButtons(isChanged);
  }, [watchFields, form.formState.defaultValues]);

  const onSubmit = (values: z.infer<typeof UpdateCardSettingsSchema>) => {
    setError("");
    setSuccess("");

    const transformedValues = {
      ...values,
      cardUrl: `http://localhost:3000/${user?.userName.toLowerCase()}/${values.cardUrl!.toLowerCase()}`,
    };

    startTransition(async () => {
      await updateCardSettings(transformedValues, currentCard!.id).then(
        (data) => {
          setError(data?.error);
          setSuccess(data?.success);
          if (data?.success) {
            setShowButtons(false);
            const oldCardUrl = `http://localhost:3000/dashboard/${currentCard!.cardUrl.split("/")[4]}`;
            const newCardUrl = `http://localhost:3000/dashboard/${values.cardUrl!.toLowerCase()}`;
            if (newCardUrl !== oldCardUrl) {
              router.push(newCardUrl);
            }
          }
        },
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <div className="flex w-full gap-4">
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Card Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Card Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cardUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Card URL</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="text-gray-600 sm:text-xs ">{`/${user?.userName.toLowerCase()}/`}</span>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Card URL"
                      className="ml-2 flex-1"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="cardVisibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Visibility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Card Visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
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
        <FormSuccess message={success} />
        <FormError message={error} />
      </form>
    </Form>
  );
};
