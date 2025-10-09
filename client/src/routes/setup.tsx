import PageNotFound from "@/components/PageNotFound";
import { organization } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { sessionQuery } from "@/lib/queryOptions";
import { apiClient } from "@/lib/utils";
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
import {
  IconArrowRight,
  IconBuilding,
  IconGitBranch,
} from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();
  const [visible, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
      branchName: "",
    },
    validate: {
      name: isNotEmpty("Required"),
      branchName: isNotEmpty("Required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    open();

    try {
      await Promise.all([
        apiClient.company.me.$patch({
          json: { name: values.name },
        }),
        organization.create({
          keepCurrentActiveOrganization: false,
          name: values.branchName,
          slug: `${values.branchName
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            )}-${Math.floor(Math.random() * 1000)}-${Date.now() % 100}`,
        }),
      ]);

      navigate({
        to: "/dashboard",
        search: {
          tourMode: true,
        },
      });
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
          <h1 className="text-2xl">Welcome, {session.data?.user.firstName}!</h1>
          <Text fw="bold" size="lg">
            Final Step: Configure Your Company
          </Text>
          <Text c="dimmed" fz="sm">
            Please provide the primary details for your company and main branch.
          </Text>
        </Box>

        <TextInput
          withAsterisk
          label="Company Name"
          leftSection={<IconBuilding size={16} stroke={1} />}
          required
          size="md"
          placeholder="Fraxum Luxury Cars"
          {...form.getInputProps("name")}
        />

        <Box>
          <TextInput
            withAsterisk
            label="Branch Name"
            leftSection={<IconGitBranch size={16} stroke={1} />}
            required
            size="md"
            placeholder="Downtown Branch"
            {...form.getInputProps("branchName")}
          />
          {form.isValid("name") && (
            <Button
              mt={4}
              size="compact-sm"
              variant="subtle"
              onClick={() => form.setFieldValue("branchName", form.values.name)}
            >
              Same as Company Name
            </Button>
          )}
        </Box>

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
