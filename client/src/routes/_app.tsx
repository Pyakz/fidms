import LinksGroup from "@/components/LinksGroup";
import ThemeToggler from "@/components/ThemeToggler";
import { signOut } from "@/lib/auth";
import { branchInvitationsQuery, sessionQuery } from "@/lib/queryOptions";
import {
  ActionIcon,
  Affix,
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  ScrollArea,
  // Text,
  // TextInput,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  // IconGitBranch,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
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
// import { isNotEmpty, useForm } from "@mantine/form";
// import { showNotification } from "@mantine/notifications";
import BranchSelector from "@/components/BranchSelector";

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

    return { session };
  },
  loader: async ({ context: { session } }) => {
    return {
      session,
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

  // const { session } = Route.useLoaderData();
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
            <ThemeToggler />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Box p="md" pb={0}>
            <BranchSelector />

            {/* <Group gap={7} align="center" justify="center">
              <Avatar
                src={session.data?.user.image ?? undefined}
                name={session.data?.user.name ?? undefined}
                alt={session.data?.user.name ?? undefined}
                radius={4}
              />

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
            </Group> */}
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

// const CreateBranch = ({
//   session,
// }: {
//   session: ReturnType<typeof Route.useLoaderData>["session"];
// }) => {
//   const form = useForm({
//     initialValues: {
//       name: "Main Branch",
//     },
//     validate: {
//       name: isNotEmpty("Required"),
//     },
//   });
//   const handleSubmit = async (values: typeof form.values) => {
//     try {
//       const activeBranch = await organization.create({
//         keepCurrentActiveOrganization: false,
//         name: values.name,
//         slug: `${values.name
//           .toLowerCase()
//           .replace(
//             /\s+/g,
//             "-"
//           )}-${Math.floor(Math.random() * 1000)}-${Date.now() % 100}`,
//       });

//       if (activeBranch) {
//         showNotification({
//           title: "Company Setup Successful",
//           message: "Your company has been set up successfully.",
//           color: "green",
//         });
//         window.location.reload();
//       }
//     } catch (error: unknown) {
//       console.log((error as { message?: string })?.message);
//       showNotification({
//         title: "Failed to Setup Company",
//         message:
//           (error as { message?: string })?.message ||
//           "An error occurred while setting up your company.",
//         color: "red",
//       });
//     } finally {
//       close();
//     }
//   };

//   return (
//     <form
//       className="space-y-5 p-10 max-w-lg w-lg"
//       onSubmit={form.onSubmit(handleSubmit)}
//     >
//       <Box>
//         <h1 className="text-2xl">Welcome, {session.data?.user.firstName}!</h1>
//         <Text size="lg">
//           Please create your first branch to get started, if you business only
//           have one location you can just name it &quot;
//           <strong>Main Branch</strong>&quot; or any name you prefer.
//         </Text>
//       </Box>

//       <TextInput
//         withAsterisk
//         label="Branch Name"
//         leftSection={<IconGitBranch size={16} stroke={1} />}
//         required
//         size="md"
//         placeholder="Downtown Branch"
//         {...form.getInputProps("name")}
//       />

//       <Button fullWidth type="submit" mt={25} size="md">
//         Create Branch
//       </Button>
//     </form>
//   );
// };
