import { queryOptions } from "@tanstack/react-query";
import { getSession } from "./auth";

export const sessionQuery = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const session = await getSession();
    if (session.error) throw new Error("Failed to fetch session");
    return session;
  },
  refetchOnWindowFocus: true,
  staleTime: 1000 * 60 * 5, // moderately cached (5 minutes fresh)
  gcTime: 1000 * 60 * 15, // garbage collected after 15 minutes
  retry: false,
});
