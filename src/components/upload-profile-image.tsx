import { useRouter } from "next/navigation";
import { useUploadThing } from "~/lib/uploadthing";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { LoadingSpinnerSVG } from "./loading-spinner";

type Input = Parameters<typeof useUploadThing>;

interface UploadButtonProps {
  children: React.ReactNode;
  onUploadComplete: (res: any) => void; // Function to handle upload completion
}

const useUploadThingInputProps = (
  onUploadComplete: (res: any) => void,
  ...args: Input
) => {
  const $ut = useUploadThing(...args);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const result = await $ut.startUpload(selectedFiles);

    console.log("uploaded files", result);
  };

  return {
    inputProps: {
      onChange,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
    onUploadComplete,
  };
};

export const UploadButton = ({
  children,
  onUploadComplete,
}: UploadButtonProps) => {
  const router = useRouter();
  const { inputProps, isUploading } = useUploadThingInputProps(
    onUploadComplete,
    "imageUploader",
    {
      onUploadBegin() {
        toast(
          <div className="flex items-center gap-2">
            <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
          </div>,
          {
            duration: 100000,
            id: "upload-begin",
          },
        );
      },
      onUploadError(error) {
        toast.dismiss("upload-begin");
        toast.error("Upload failed");
      },
      onClientUploadComplete(res) {
        toast.dismiss("upload-begin");
        toast(
          <div className="flex items-center gap-2">
            <Check />
            <span className="text-lg">Upload complete!</span>
          </div>,
        );
        console.log(res);

        // Call the provided onUploadComplete function
        onUploadComplete(res);

        router.refresh(); // Refresh the router after upload
      },
    },
  );

  return (
    <div className="flex h-full w-full items-center justify-center">
      <label
        htmlFor="upload-button"
        className="flex cursor-pointer items-center justify-center gap-2"
      >
        {children}
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        {...inputProps}
      />
    </div>
  );
};
