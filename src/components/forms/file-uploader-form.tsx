"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useUploadFile } from "~/hooks/use-upload-file";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorMessage } from "~/lib/handle-error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { FileUploader } from "../file-uploader";
import { ImageSchema } from "~/schemas";
import { addImageToCard } from "~/actions/card";
import { getImageByUrl } from "~/server/queries";
import { useRouter } from "next/navigation";
import { LoadingSpinnerSVG } from "../loading-spinner";
import { Check } from "lucide-react";
import { LoadingButton } from "../loading-button";

export function FileUploaderForm({
  cardId,
  disabled,
}: {
  cardId: number;
  disabled: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] },
  );
  const form = useForm<z.infer<typeof ImageSchema>>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      images: [],
    },
  });

  const watchFields = useWatch({ control: form.control });

  useEffect(() => {
    const defaultValues = form.formState.defaultValues as z.infer<
      typeof ImageSchema
    >;
    // Function to recursively compare objects
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

    // Check if any field has changed
    const isChanged = !deepEqual(watchFields, defaultValues);

    setShowButtons(isChanged);
  }, [watchFields, form.formState.defaultValues]);

  function onSubmit(input: z.infer<typeof ImageSchema>) {
    setLoading(true);

    toast.promise(uploadFiles(input.images), {
      loading: (
        <div className="flex items-center gap-2">
          <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
        </div>
      ),
      success: () => {
        form.reset();
        setLoading(false);
        return (
          <div className="flex items-center gap-2">
            <Check />
            <span className="text-lg">Upload complete!</span>
          </div>
        );
      },
      error: (err) => {
        setLoading(false);
        return getErrorMessage(err);
      },
    });
  }

  useEffect(() => {
    const addImagesToCard = async () => {
      for (const file of uploadedFiles) {
        try {
          const image = await getImageByUrl(file.url);
          const imageId = image?.id;
          if (!imageId) return;
          await addImageToCard(cardId, imageId);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Failed to add image to card: ${error.message}`);
          }
        } finally {
          router.refresh();
        }
      }
    };

    if (uploadedFiles.length > 0) {
      addImagesToCard();
    }
  }, [uploadedFiles]);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={10}
                    maxSize={1024 * 1024 * 4}
                    progresses={progresses}
                    disabled={isUploading || disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        {showButtons && (
          <LoadingButton className="w-fit" loading={loading}>
            Save
          </LoadingButton>
        )}
      </form>
    </Form>
  );
}
