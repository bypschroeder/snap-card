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
        <h1 className="font-heading text-6xl font-semibold text-black drop-shadow-md">
          SnapCard
        </h1>
        <p className="text-lg text-black">
          Craft your Digital Business Card with Ease!
        </p>
        <div>
          <LoginButton>
            <Button variant="default" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
