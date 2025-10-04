import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { auth } from "@server/auth";

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  getLastUsedLoginMethod,
} = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), lastLoginMethodClient()],
});
