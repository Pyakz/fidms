import PageNotFound from "@/components/PageNotFound";
import { organization } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { pendingInvitations, sessionQuery } from "@/lib/queryOptions";
import {
  Box,
  Button,
  Center,
  Loader,
  LoadingOverlay,
  Paper,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import moment from "moment";
import React from "react";
import { z } from "zod";

export const Route = createFileRoute("/invitations")({
  beforeLoad: async ({ location, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (!session.data?.user) {
      queryClient.clear();
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      });
    }
    const invitations = await queryClient.ensureQueryData(pendingInvitations);
    console.log(invitations);
    if (invitations?.pendingInvitations.length === 0) {
      throw redirect({ to: "/dashboard" });
    }

    return { session, invitations };
  },
  validateSearch: z.object({
    redirect: z.string().catch("").optional().nullable(),
  }),
  loader: async ({ context: { session, invitations } }) => {
    return { session, invitations };
  },
  component: RouteComponent,
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
  notFoundComponent: () => <PageNotFound height={FULL_HEIGHT} />,
  head: (ctx) => {
    return {
      meta: [
        {
          title: `(${ctx.loaderData?.invitations.pendingInvitations.length}) Branch Invitations`,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { invitations, session } = Route.useLoaderData();
  const [loading, setLoading] = React.useState(false);

  const queryClent = useQueryClient();

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2, color: "rgba(0, 0, 0, 0.25)" }}
      />

      <div className="space-y-5 p-5 max-w-lg">
        <Box>
          <h1 className="text-2xl">Hey, {session?.data?.user.firstName}!</h1>
          <Text fw="bold" size="lg">
            {invitations?.pendingInvitations.length > 1
              ? `You have been invited to join the following branches:`
              : `You have been invited to join the following branch:`}
          </Text>
        </Box>

        {invitations?.pendingInvitations.map((invitation) => (
          <Paper key={invitation.id} className="p-3 text-center" withBorder>
            <Text mb="lg">
              <strong>{invitation.inviter.firstName}</strong> invited you to
              join <strong>{invitation.organization.name}</strong> as their{" "}
              <strong>{invitation.role}</strong>, this invitation will expire in{" "}
              <strong>{moment(invitation.expiresAt).format("LLL")}</strong>
            </Text>

            <Button
              disabled={loading}
              fullWidth
              size="md"
              onClick={async () => {
                setLoading(true);
                try {
                  await organization.acceptInvitation({
                    invitationId: invitation.id,
                  });
                  queryClent.invalidateQueries(pendingInvitations);
                  queryClent.invalidateQueries(sessionQuery);
                  window.location.reload();
                } catch (error) {
                  console.error("Error accepting invitation:", error);
                  showNotification({
                    title: "Error accepting invitation",
                    message: "Please try again later.",
                    color: "red",
                    autoClose: 3000,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            >
              Accept
            </Button>
          </Paper>
        ))}
      </div>
    </Center>
  );
}
