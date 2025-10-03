import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dbClient from "./db";

export const auth = betterAuth({
  appName: "FIDMS",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    },
  },
  database: drizzleAdapter(dbClient, {
    provider: "pg",
  }),
  trustedOrigins: ["http://localhost:5173"],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
