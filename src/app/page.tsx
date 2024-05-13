import { LoginButton } from "~/components/auth/login-button";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

// export const dynamic = "force-dynamic"

export default async function HomePage() {
  const user = await db.query.users.findMany();

  console.log(user);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="font-heading text-6xl font-semibold drop-shadow-md ">
          SnapCard
        </h1>
        <p className="text-xl font-medium">
            Craft your Digital Business Card
            <span className="text-primary mx-2 font-bold text-2xl relative inline-block stroke-current">
                with Ease!
                <svg className="absolute -bottom-0.5 w-full max-h-1.5" viewBox="0 0 55 5" xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none">
                    <path d="M0.652466 4.00002C15.8925 2.66668 48.0351 0.400018 54.6853 2.00002" stroke-width="1.5"></path>
                </svg>
            </span>
        </p>
        <div>
          <LoginButton>
            <Button variant="default" size="lg">
              Get started
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
