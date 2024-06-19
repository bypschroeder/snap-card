import { useState } from "react";
import { toast } from "sonner";
import { UploadFilesOptions } from "uploadthing/types";
import { OurFileRouter } from "~/app/api/uploadthing/core";
import { getErrorMessage } from "~/lib/handle-error";
import { uploadFiles } from "~/lib/uploadthing";
import { UploadedFile } from "~/types/uploadthing";

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  async function uploadThings(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => ({
            ...prev,
            [file]: progress,
          }));
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
