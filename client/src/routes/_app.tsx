import { signOut } from "@/lib/auth";
import { sessionQuery } from "@/lib/queryOptions";
import { Alert, AppShell, Burger, Button, Center, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
      queryClient.invalidateQueries();
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href, // save current location for after login
        },
      });
    }
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
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar>
        <Link to="/dashboard" preload="intent">
          Dashboard
        </Link>
        <br />
        <Link to="/profile" preload="intent">
          Profile
        </Link>
        <br />
        <Link to="/settings" preload="intent">
          Settings
        </Link>
        <div className="p-5">
          <Button
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({ to: "/sign-in" });
                  },
                  onRequest: () => queryClient.clear(),
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
