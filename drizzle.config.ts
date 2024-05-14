import { env } from "~/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["snap-card_*"],
});
