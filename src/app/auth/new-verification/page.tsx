import { Suspense } from "react";
import { NewVerificationForm } from "~/components/new-verification-form";

const NewVerificationPage = () => {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
};

export default NewVerificationPage;
