import LinksGroup from "@/components/LinksGroup";
import { organization, signOut } from "@/lib/auth";
import { branchInvitationsQuery, sessionQuery } from "@/lib/queryOptions";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  Menu,
  Paper,
  ScrollArea,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMoon,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { FULL_HEIGHT, HEADER_HEIGHT, SIDEBAR_LINKS } from "@/lib/constant";
import PageNotFound from "@/components/PageNotFound";
import Breadcrumb from "@/components/Breadcrumb";
import { z } from "zod";
// import { isNotEmpty, useForm } from "@mantine/form";
// import { showNotification } from "@mantine/notifications";
import BranchSelector from "@/components/BranchSelector";
import { startCase } from "lodash";
import GlobalSearch from "@/components/GlobalSearch";
import ThemeToggler from "@/components/ThemeToggler";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
  validateSearch: z.object({
    tourMode: z.boolean().catch(false).optional(),
  }),
  beforeLoad: async ({ location, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (!session.data?.user) {
      queryClient.clear();
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }

    const invitations = await queryClient.ensureQueryData(
      branchInvitationsQuery
    );

    if (invitations.filter(({ status }) => status === "pending").length > 0) {
      throw redirect({
        to: "/invitations",
        search: {
          redirect: location.href,
        },
      });
    }

    if (!session.data?.user.defaultOrganizationId) {
      throw redirect({
        to: "/setup",
        search: {
          redirect: location.href,
        },
      });
    }

    return { session };
  },
  loader: async ({ context: { session } }) => {
    const role = await organization.getActiveMemberRole();

    return {
      session,
      role,
    };
  },
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
  notFoundComponent: () => <PageNotFound height={FULL_HEIGHT} />,
  head: (ctx) => {
    console.log(ctx);
    return {
      meta: [
        {
          title: "Setup Company",
        },
      ],
    };
  },
});

function LayoutComponent() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (computedColorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [computedColorScheme]);

  const { session, role } = Route.useLoaderData();
  const [
    visibleLoadingDrawer,
    { open: openLoadingDrawer, close: closeLoadingDrawer },
  ] = useDisclosure(false);

  const [mobileOpened, { toggle: toggleMobile, close: closeSideBar }] =
    useDisclosure();

  const [minimized, setMinimized] = useLocalStorage({
    key: "sidebar-minimized",
    defaultValue: false,
  });

  return (
    <Fragment>
      <LoadingOverlay
        visible={visibleLoadingDrawer}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2, color: "rgba(0, 0, 0, 0.25)" }}
      />

      <AppShell
        layout="alt"
        header={{ height: HEADER_HEIGHT }}
        navbar={{
          width: minimized ? 80 : 280,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened },
        }}
        styles={(theme) => ({
          navbar: {
            backgroundColor:
              computedColorScheme === "dark"
                ? theme.colors.neutral[8]
                : "#FAFAFA",
            borderColor:
              computedColorScheme === "dark"
                ? theme.colors.zinc[7]
                : theme.colors.gray[2],
          },
          header: {
            borderColor:
              computedColorScheme === "dark"
                ? theme.colors.zinc[7]
                : theme.colors.gray[2],
          },
        })}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" justify="space-between" px="sm">
            <Group visibleFrom="sm">
              <ActionIcon
                variant="transparent"
                onClick={() => setMinimized((m) => !m)}
                visibleFrom="sm"
                size="lg"
                color="secondary"
              >
                {minimized ? (
                  <IconLayoutSidebarLeftExpand size={20} stroke={1.6} />
                ) : (
                  <IconLayoutSidebarLeftCollapse size={20} stroke={1.6} />
                )}
              </ActionIcon>
              <Breadcrumb />
            </Group>

            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Group>
              <GlobalSearch />
              <ThemeToggler />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Box
            p="xs"
            pb={0}
            className="flex items-center gap-x-2 justify-center"
          >
            <BranchSelector />
            <ActionIcon
              radius={4}
              hiddenFrom="sm"
              variant="default"
              size="lg"
              onClick={toggleMobile}
            >
              <IconX size={20} stroke={1.6} />
            </ActionIcon>
          </Box>

          <ScrollArea className="flex-1 text-center" p="xs">
            {SIDEBAR_LINKS.map((item) => (
              <LinksGroup
                {...item}
                key={item.label}
                closeSidebarOnClick={closeSideBar}
                minimized={minimized}
              />
            ))}
          </ScrollArea>
          <Menu
            position={minimized ? "right-end" : "top"}
            arrowPosition="center"
            width={260}
            withArrow
            shadow="lg"
          >
            <Menu.Target>
              <Box p={minimized ? "md" : "xs"} className="flex justify-center">
                {minimized ? (
                  <Avatar
                    src={session.data?.user.image}
                    name={session?.data?.user.name}
                    radius={4}
                    className="rounded cursor-pointer"
                    variant="light"
                    size={45}
                  />
                ) : (
                  <Paper className="w-full cursor-pointer" withBorder>
                    <Group gap={8} className="p-1.5 rounded">
                      <Avatar
                        src={session.data?.user.image}
                        name={session?.data?.user.name}
                        radius={4}
                      />

                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {startCase(session.data?.user.name)}
                        </Text>

                        <Text c="dimmed" size="xs">
                          {startCase(role.data?.role)}
                        </Text>
                      </div>

                      <IconDotsVertical size={14} className="mr-1" />
                    </Group>
                  </Paper>
                )}
              </Box>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  computedColorScheme === "light" ? (
                    <IconMoon size={14} />
                  ) : (
                    <IconSun size={14} />
                  )
                }
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
              >
                {computedColorScheme === "light" ? "Dark Mode" : "Light Mode"}
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUser size={14} />}
                component={Link}
                to="/profile"
                preload="intent"
              >
                Profile
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onRequest: openLoadingDrawer,
                      onError: closeLoadingDrawer,
                      onSuccess: () => {
                        close();
                        queryClient.clear();
                        navigate({
                          to: "/sign-in",
                        });
                      },
                    },
                  })
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </Fragment>
  );
}
