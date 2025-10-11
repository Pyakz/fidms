import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import dbClient from "./db";
import { lastLoginMethod, openAPI, organization } from "better-auth/plugins";
import { createAuthClient } from "better-auth/client";
import {
  customSessionClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  organizationClient,
} from "better-auth/client/plugins";
import { user } from "./db/schemas/auth";
import { eq } from "drizzle-orm";

export const authClient = createAuthClient({
  plugins: [
    customSessionClient<typeof auth>(),
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
    afterVerificationRedirectURL: `/setup`,
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

      defaultOrganizationId: {
        type: "string",
        required: false,
        returned: true,
        input: false,
      },
    },
  },
  // hooks: {
  //   before: createAuthMiddleware(async (ctx) => {
  //     console.log("------- Before Create User Hook -------", ctx);
  //   }),
  // },
  databaseHooks: {
    user: {
      create: {
        before: async (data) => {
          console.log("------- Before Create User Hook -------", data);
        },
        after: async (user, ctx) => {
          console.log("------- After Create User Hook -------", user, ctx);
        },
      },
    },
    session: {
      create: {
        async before(session) {
          const activeOrganizationId = await dbClient
            .select({ defaultOrganizationId: user.defaultOrganizationId })
            .from(user)
            .where(eq(user.id, session.userId))
            .then((res) => res[0]?.defaultOrganizationId || null);

          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          };
        },
      },
      update: {
        async after(session) {
          await dbClient
            .update(user)
            .set({
              defaultOrganizationId: session.activeOrganizationId as string,
            })
            .where(eq(user.id, session.userId));
        },
      },
    },
  },

  trustedOrigins: ["http://localhost:5173"],
  plugins: [
    openAPI(),
    lastLoginMethod(),
    organization({
      schema: {},
      organizationHooks: {
        // beforeCreateOrganization: async ({ organization, user }) => {},

        afterCreateOrganization: async ({
          organization,
          member,
          user: currentUser,
        }) => {
          console.log("----->afterCreateOrganization", {
            organization,
            member,
            currentUser,
          });
          await dbClient
            .update(user)
            .set({ defaultOrganizationId: organization.id })
            .where(eq(user.id, currentUser.id))
            .returning();
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
          user: currentUser,
          organization,
        }) => {
          await dbClient
            .update(user)
            .set({ defaultOrganizationId: organization.id })
            .where(eq(user.id, currentUser.id));

          console.log("----->afterAcceptInvitation", {
            invitation,
            member,
            currentUser,
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
