import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@server/auth";

export const { signIn, signOut, signUp, useSession } = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
