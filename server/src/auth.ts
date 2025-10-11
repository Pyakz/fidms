import { betterAuth, type BetterAuthOptions } from "better-auth";
import { lastLoginMethod, openAPI, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import dbClient from "./db";
import { user } from "./db/schemas/auth";
import { eq } from "drizzle-orm";

const authConfig = {
  appName: "FIDMS",
  database: drizzleAdapter(dbClient, {
    provider: "pg",
  }),
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
  databaseHooks: {
    user: {
      create: {
        after: async (user, ctx) => {
          console.log("------- After Create User Hook -------", user, ctx);
        },
      },
    },
    session: {
      create: {
        async before(session) {
          const activeOrganizationId = await dbClient
            .select({ activeOrganizationId: user.defaultOrganizationId })
            .from(user)
            .where(eq(user.id, session.userId))
            .then((res) => res[0]?.activeOrganizationId || null);

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
      organizationHooks: {
        // set defaultOrganizationId in user table after creating organization
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
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
