"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import useUserStore from "~/store/useUserStore";
import { PasswordUpdateSchema, UserSchema } from "~/schemas";
import { updatePassword, updateProfileImage, updateUser } from "~/actions/user";
import { getImageById } from "~/server/queries";

import { User } from "~/types/user";

import { Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { UploadButton } from "../upload-profile-image";
import { UploadSVG } from "../upload-svg";
import { LoadingButton } from "../loading-button";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const ProfileForm = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const userForm = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: user!.firstName,
      lastName: user!.lastName,
      userName: user!.userName,
      email: user!.email,
    },
  });

  useEffect(() => {
    if (user) {
      userForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      });
    }
  }, [user, userForm]);

  const passwordForm = useForm<z.infer<typeof PasswordUpdateSchema>>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const watchFields = useWatch({ control: userForm.control });

  useEffect(() => {
    const defaultValues = userForm.formState.defaultValues as z.infer<
      typeof UserSchema
    >;

    const hasChanged = (key: keyof z.infer<typeof UserSchema>) => {
      return watchFields[key] !== defaultValues[key];
    };

    const isChanged = Object.keys(defaultValues).some((key) =>
      hasChanged(key as keyof z.infer<typeof UserSchema>),
    );

    setShowButtons(isChanged);
  }, [watchFields, userForm.formState.defaultValues]);

  const onUserSubmit = (values: z.infer<typeof UserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      await updateUser(values, user!.id).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data.success) {
          setUser(data.user as User);
          setShowButtons(false);
        }
      });
    });
  };

  const onPasswordSubmit = (values: z.infer<typeof PasswordUpdateSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      await updatePassword(values, user!.id).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
      setShowPasswordInput(false);
    });
  };

  const handleUserCancel = () => {
    userForm.reset(userForm.formState.defaultValues);
  };

  const handlePasswordCancel = () => {
    passwordForm.reset(passwordForm.formState.defaultValues);
    setShowPasswordInput(false);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (!user?.image) return;
      const image = await getImageById(user.image);
      if (!image) return;
      setImageUrl(image?.url);
    };

    fetchImage();
  }, [user?.image]);

  const handleUserImageUpload = async (res: any) => {
    updateProfileImage(user!.id, res[0].url);
  };
  return (
    <div className="flex flex-col">
      <Form {...userForm}>
        <form
          onSubmit={userForm.handleSubmit(onUserSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <UploadButton onUploadComplete={handleUserImageUpload}>
            <Avatar className="h-36 w-36 outline outline-2 outline-border">
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
              control={userForm.control}
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
              control={userForm.control}
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
          <div className="flex w-full gap-4">
            <FormField
              control={userForm.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex items-center gap-2">
                    <FormLabel>User Name</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type="button">
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Your User Name is used for the url creation of your
                            cards
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Example"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
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
        </form>
      </Form>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-6"
        >
          {!showPasswordInput && (
            <Button
              className="-p-1 flex justify-start"
              variant={"link"}
              size={"sm"}
              onClick={() => setShowPasswordInput(true)}
            >
              Change Password
            </Button>
          )}
          {showPasswordInput && (
            <>
              <div className="mt-2 flex w-full gap-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full gap-4">
                <LoadingButton loading={isPending} type="submit">
                  Update
                </LoadingButton>
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={handlePasswordCancel}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
        </form>
      </Form>
    </div>
  );
};
