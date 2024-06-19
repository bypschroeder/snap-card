"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { newVerification } from "~/actions/new-verification";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const LoadingDotsSVG = () => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="spinner_qM83" cx="7" cy="22" r="6" />
      <circle className="spinner_qM83 spinner_oXPr" cx="22" cy="22" r="6" />
      <circle className="spinner_qM83 spinner_ZTLf" cx="36" cy="22" r="6" />
    </svg>
  );
};

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    await newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <LoadingDotsSVG />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
