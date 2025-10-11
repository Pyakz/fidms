import PageNotFound from "@/components/PageNotFound";
import { organization } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { sessionQuery } from "@/lib/queryOptions";
import {
  Box,
  Button,
  Center,
  Loader,
  LoadingOverlay,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconArrowRight, IconBuilding } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/setup")({
  component: RouteComponent,
  beforeLoad: async ({ location, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (!session.data?.user) {
      queryClient.clear();
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      });
    }

    if (session.data?.user.defaultOrganizationId) {
      throw redirect({ to: "/dashboard" });
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
  notFoundComponent: () => <PageNotFound height={FULL_HEIGHT} />,
  head: () => ({
    meta: [
      {
        title: "Setup Company",
      },
    ],
  }),
});

function RouteComponent() {
  const { session } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [visible, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: {
      name: isNotEmpty("Required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      await organization.create({
        keepCurrentActiveOrganization: false,
        name: values.name,
        slug: `${values.name
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          )}-${Math.floor(Math.random() * 1000)}-${Date.now() % 100}`,
      });
      queryClient.refetchQueries(sessionQuery);
      window.location.reload();
    } catch (error: unknown) {
      console.log((error as { message?: string })?.message);

      showNotification({
        title: "Failed to Setup Company",
        message:
          (error as { message?: string })?.message ||
          "An error occurred while setting up your company.",
        color: "red",
      });
    } finally {
      close();
    }
  };

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2, color: "rgba(0, 0, 0, 0.25)" }}
      />
      <form
        className="space-y-5 p-10 max-w-lg w-lg"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Box>
          <h1 className="text-2xl">
            Welcome, {session?.data?.user.firstName}!
          </h1>
          <Text fw="bold" size="lg">
            Configure Your Company
          </Text>
          <Text c="dimmed" fz="sm">
            Please provide the primary details for your company, you can update
            more later.
          </Text>
        </Box>

        <TextInput
          withAsterisk
          leftSection={<IconBuilding size={16} stroke={1} />}
          required
          size="md"
          placeholder="Fraxum Dealership"
          {...form.getInputProps("name")}
        />

        <Button
          fullWidth
          type="submit"
          mt={25}
          size="md"
          rightSection={<IconArrowRight size={16} stroke={1} />}
        >
          Finish Setup
        </Button>
      </form>
    </Center>
  );
}
