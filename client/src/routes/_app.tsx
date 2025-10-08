import LinksGroup from "@/components/LinksGroup";
import ThemeToggler from "@/components/ThemeToggler";
import { signOut } from "@/lib/auth";
import { sessionQuery } from "@/lib/queryOptions";
import {
  ActionIcon,
  Affix,
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  ScrollArea,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  // IconLayoutSidebarLeftCollapse,
  // IconLayoutSidebarLeftExpand,
  IconSelector,
  IconX,
} from "@tabler/icons-react";
import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { FULL_HEIGHT, HEADER_HEIGHT, SIDEBAR_LINKS } from "@/lib/constant";
import PageNotFound from "@/components/PageNotFound";
import Breadcrumb from "@/components/Breadcrumb";
import { z } from "zod";

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
          redirect: location.href, // save current location for after login
        },
      });
    }

    // if (session.data.session.activeOrganizationId === null) {
    //   throw redirect({
    //     to: "/onboarding",
    //   });
    // }

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
  notFoundComponent: () => <PageNotFound height={FULL_HEIGHT} />,
});

function LayoutComponent() {
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

  const { session } = Route.useLoaderData();
  const [
    visibleLoadingDrawer,
    { open: openLoadingDrawer, close: closeLoadingDrawer },
  ] = useDisclosure(false);
  const [mobileOpened, { toggle: toggleMobile, close: closeSideBar }] =
    useDisclosure();
  // const [minimized, { toggle: toggleMinimized }] = useDisclosure(false);
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
            <ThemeToggler />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Box p="md" pb={0}>
            <Group gap={7} align="center" justify="center">
              <Avatar
                src={session.data?.user.image ?? undefined}
                name={session.data?.user.name ?? undefined}
                alt={session.data?.user.name ?? undefined}
                radius={4}
              />
              {/* <div style={{ flex: 1 }}>
                <Text size="xs" fw={500}>
                  {session.data?.user.firstName} {session.data?.user.lastName}
                </Text>

                <Text c="dimmed" size="xs">
                  {session.data?.user.email}
                </Text>
              </div>
              <IconSelector size={16} /> */}
              {!minimized && (
                <Fragment>
                  <div style={{ flex: 1 }}>
                    <Text size="xs" fw={500}>
                      {session.data?.user.firstName}{" "}
                      {session.data?.user.lastName}
                    </Text>

                    <Text c="dimmed" size="xs">
                      {session.data?.user.email}
                    </Text>
                  </div>
                  <IconSelector size={16} />
                </Fragment>
              )}
            </Group>
          </Box>
          <ScrollArea className="flex-1" p="md">
            {SIDEBAR_LINKS.map((item) => (
              <LinksGroup
                {...item}
                key={item.label}
                closeSidebarOnClick={closeSideBar}
                minimized={minimized}
              />
            ))}
          </ScrollArea>
          <div className="p-3">
            <Button
              fullWidth
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
            </Button>
          </div>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>

      <Affix
        position={{ bottom: 380, right: 15 }}
        hiddenFrom="sm"
        hidden={!mobileOpened}
      >
        <ActionIcon
          radius={50}
          onClick={toggleMobile}
          size="xl"
          variant="gradient"
          gradient={{ from: "primary", to: "info", deg: 45 }}
          className="shadow-lg"
        >
          <IconX size={20} stroke={1.6} />
        </ActionIcon>
      </Affix>
    </Fragment>
  );
}
