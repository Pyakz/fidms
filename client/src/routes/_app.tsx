import { signOut } from "@/lib/auth";
import { sessionQuery } from "@/lib/queryOptions";
import {
  Alert,
  AppShell,
  Avatar,
  Burger,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
  beforeLoad: async ({ location, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (!session.data?.user) {
      queryClient.clear();
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href, // save current location for after login
        },
      });
    }
    return { session };
  },
  loader: ({ context: { session } }) => {
    return { session };
  },
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
  errorComponent: ({ error }) => (
    <Center className="h-screen">
      <Alert variant="light" color="rgba(255, 0, 0, 1)" title="Error">
        {error.message}
      </Alert>
    </Center>
  ),
});

function LayoutComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { session } = Route.useLoaderData();
  const [visible, { open, close }] = useDisclosure(false);

  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar className="space-y-4">
        <div className="p-2">
          <Group gap={8}>
            <Avatar
              src={session.data?.user.image ?? undefined}
              name={session.data?.user.name ?? undefined}
              alt={session.data?.user.name ?? undefined}
              radius={2}
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Harriette Spoonlicker
              </Text>

              <Text c="dimmed" size="xs">
                hspoonlicker@outlook.com
              </Text>
            </div>

            <IconChevronRight size={14} stroke={1.5} />
          </Group>
        </div>

        <Link to="/dashboard" preload="intent">
          Dashboard
        </Link>
        <Link to="/profile" preload="intent">
          Profile
        </Link>

        <Link to="/settings" preload="intent">
          Settings
        </Link>

        <div className="p-5">
          <Button
            onClick={() =>
              signOut({
                fetchOptions: {
                  onError: close,
                  onRequest: open,
                  onSuccess: () => {
                    queryClient.clear();
                    close();
                    navigate({
                      to: "/sign-in",
                      reloadDocument: true,
                      replace: true,
                    });
                  },
                },
              })
            }
          >
            Logout
          </Button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
