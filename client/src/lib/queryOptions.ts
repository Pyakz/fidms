import { queryOptions } from "@tanstack/react-query";
import { getSession, organization } from "./auth";
import { apiClient } from "./utils";

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

export const branchesQuery = queryOptions({
  queryKey: ["branches"],
  queryFn: async () => {
    const res = await organization.list();
    if (res.error) throw new Error("Failed to fetch branches");
    return res.data;
  },
});

// make sure to not call this too often, since a user likely won't have many invitations
export const branchInvitationsQuery = queryOptions({
  queryKey: ["branch-invitations"],
  queryFn: async () => {
    const res = await organization.listUserInvitations();
    if (res.error) throw new Error("Failed to fetch branch invitations");
    return res.data;
  },
  staleTime: 1000 * 60 * 1, // cached for 1 minute
  gcTime: 1000 * 60 * 5, // garbage collected after 5 minutes
  retry: false,
});

export const pendingInvitations = queryOptions({
  queryKey: ["pending-invitations"],
  queryFn: async () => {
    const res = await apiClient["pending-invitations"].$get();

    if (!res.ok) {
      throw new Error("Failed to fetch pending invitations");
    }

    return await res.json();
  },
  staleTime: 1000 * 60 * 1, // cached for 1 minute
  gcTime: 1000 * 60 * 5, // garbage collected after 5 minutes
  retry: false,
});
