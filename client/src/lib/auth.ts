import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { auth } from "@server/auth";
import { organizationClient } from "better-auth/client/plugins";
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  getLastUsedLoginMethod,
  organization,
  useListOrganizations,
} = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    lastLoginMethodClient(),
    organizationClient(),
  ],
});
