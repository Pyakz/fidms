import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dbClient from "./db";
import { lastLoginMethod, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "FIDMS",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile?.family_name || profile.given_name,
          image: profile?.picture,
        };
      },
    },
  },
  database: drizzleAdapter(dbClient, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        returned: true,
      },
      lastName: {
        type: "string",
        required: true,
        returned: true,
      },
    },
  },
  trustedOrigins: ["http://localhost:5173"],
  plugins: [openAPI(), lastLoginMethod()],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
