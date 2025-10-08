import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dbClient from "./db";
import {
  createAuthMiddleware,
  lastLoginMethod,
  openAPI,
  organization,
} from "better-auth/plugins";
import { createAuthClient } from "better-auth/client";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
  organizationClient,
} from "better-auth/client/plugins";
import { company } from "./db/schemas/company";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
    organizationClient(),
  ],
});

export const auth = betterAuth({
  appName: "FIDMS",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("sendVerificationEmail----------------->", {
        user,
        url,
        token,
        request,
      });
    },
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
      onboarded: {
        type: "boolean",
        required: false,
        defaultValue: false,
        returned: true,
        input: false,
      },
      companyId: {
        type: "string",
        required: false,
        returned: true,
        input: true,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const newCompany = await dbClient
          .insert(company)
          .values({})
          .returning({ id: company.id });

        if (!newCompany[0]?.id) {
          throw new APIError("BAD_REQUEST", {
            code: "FAILED_TO_CREATE_USER",
            message: "Unable to create account, please contact support.",
          });
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              companyId: newCompany[0]?.id,
            },
          },
        };
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (data) => {
          if (!data.companyId) {
            const newCompany = await dbClient
              .insert(company)
              .values({})
              .returning({ id: company.id });

            if (!newCompany[0]?.id) {
              throw new APIError("BAD_REQUEST", {
                code: "FAILED_TO_CREATE_USER",
                message: "Unable to create account, please contact support.",
              });
            }

            data.companyId = newCompany[0]?.id;
          }

          return { data };
        },
        after: async (user, ctx) => {
          console.log("------- After Create User Hook -------", user, ctx);
        },
      },
    },
  },

  trustedOrigins: ["http://localhost:5173"],
  plugins: [
    openAPI(),
    lastLoginMethod(),
    organization({
      schema: {
        organization: {
          additionalFields: {
            companyId: {
              type: "string",
              required: false,
              returned: true,
              input: false,
            },
          },
        },
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization, user }) => {
          return {
            data: {
              ...organization,
              companyId: user?.companyId || null,
            },
          };
        },

        beforeCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          console.log("----->beforeCreateInvitation", {
            invitation,
            inviter,
            organization,
          });
        },

        // After creating an invitation
        afterCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          console.log("------------->afterCreateInvitation", {
            // current url + invitation/:invitation.id
            url: `/invitation/${invitation.id}`,
            inviter,
            organization,
          });
        },

        // Before accepting an invitation
        beforeAcceptInvitation: async ({ invitation, user, organization }) => {
          console.log("----->beforeAcceptInvitation", {
            invitation,
            user,
            organization,
          });
        },

        // After accepting an invitation
        afterAcceptInvitation: async ({
          invitation,
          member,
          user,
          organization,
        }) => {
          console.log("----->afterAcceptInvitation", {
            invitation,
            member,
            user,
            organization,
          });
        },
      },
    }),
  ],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
