import type * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { CreateCardSchema } from "~/schemas";
import { createCard } from "~/actions/card";
import { LoadingButton } from "~/components/loading-button";
import { FormError } from "~/components/form-error";
import { FormSuccess } from "~/components/form-success";
import { useRouter } from "next/navigation";

export const NewCardForm = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateCardSchema>>({
    resolver: zodResolver(CreateCardSchema),
    defaultValues: {
      userId: user!.id,
      cardName: "",
      cardUrl: "",
      cardVisibility: "public",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateCardSchema>) => {
    setError("");
    setSuccess("");

    if (!user) {
      throw new Error("User is undefined");
    }

    const newCardUrl = `http://localhost:3000/${user?.userName.toLowerCase()}/${values.cardUrl.toLowerCase()}`;

    const updatedValues = {
      ...values,
      cardUrl: newCardUrl,
    };

    startTransition(async () => {
      await createCard(updatedValues).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data?.success) {
          router.push(`/dashboard/${values.cardUrl.toLowerCase()}`);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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
        <FormField
          control={form.control}
          name="cardVisibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Visibility</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
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
        <LoadingButton type="submit" loading={isPending}>
          Create Card
        </LoadingButton>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </Form>
  );
};
