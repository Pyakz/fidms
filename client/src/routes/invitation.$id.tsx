import { organization, signOut, signUp } from "@/lib/auth";
import { BETTER_AUTH_ERROR_CODES } from "@/lib/enums";
import { apiClient } from "@/lib/utils";
import {
  Alert,
  Box,
  Button,
  Center,
  Loader,
  LoadingOverlay,
  PasswordInput,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconClockExclamation, IconLock } from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import dayjs from "dayjs";
import { sessionQuery } from "@/lib/queryOptions";
import PageNotFound from "@/components/PageNotFound";
import { FULL_HEIGHT } from "@/lib/constant";

export const Route = createFileRoute("/invitation/$id")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (session.data?.user) {
      await signOut({ fetchOptions: { onSuccess: () => queryClient.clear() } });
    }
    try {
      const response = await apiClient.invitation[":id"].$get({
        param: { id: params.id },
      });

      // 3. Early return for non-OK responses (4xx, 5xx)
      if (!response.ok) {
        throw redirect({ to: "/", statusCode: response.status });
      }

      const data = await response.json();
      return { invitation: data.invitation };
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching invitation:", error);

      // Treat any network or parsing error as a failure and redirect
      throw redirect({ to: "/", statusCode: 400 });
    }
  },
  pendingComponent: () => (
    <Center className="h-screen">
      <Loader />
    </Center>
  ),
  notFoundComponent: () => <PageNotFound height={FULL_HEIGHT} />,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [visible, { open, close }] = useDisclosure(false);
  const [error, setError] = useState<string | null>(null);

  const { invitation } = Route.useLoaderData();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    validate: {
      firstName: isNotEmpty("Required"),
      lastName: isNotEmpty("Required"),
      password: isNotEmpty("Required"),
    },
  });

  const handleSubmit = (values: typeof form.values) =>
    signUp.email(
      {
        name: `${values.firstName} ${values.lastName}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: invitation.email,
        password: values.password,
        callbackURL: `${window.location.origin}/dashboard?tourMode=true`,
        companyId: invitation.organization.companyId,
      },
      {
        onRequest: open,
        onResponse: close,
        onError: (ctx) => {
          if (ctx.error) {
            const errorFieldMap: Record<string, "email" | "password"> = {
              [BETTER_AUTH_ERROR_CODES.PASSWORD_TOO_LONG]: "password",
              [BETTER_AUTH_ERROR_CODES.PASSWORD_TOO_SHORT]: "password",
              [BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS]: "email",
              [BETTER_AUTH_ERROR_CODES.INVALID_EMAIL]: "email",
              [BETTER_AUTH_ERROR_CODES.FAILED_TO_CREATE_USER]: "email",
              [BETTER_AUTH_ERROR_CODES.FAILED_TO_CREATE_SESSION]: "email",
              // [BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL]:
              //   "email",
            };

            const field = errorFieldMap[ctx.error.code];
            if (field) {
              form.setFieldError(field, ctx.error.message);
            } else {
              setError(ctx.error.message);
            }
          }
        },
        onSuccess: async () => {
          await organization.acceptInvitation({ invitationId: invitation.id });
          navigate({
            to: "/dashboard",
            reloadDocument: true,
            replace: true,
            search: {
              tourMode: true,
            },
          });
        },
      }
    );

  if (dayjs(invitation.expiresAt).isBefore(dayjs())) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] h-screen p-8 text-center">
        <IconClockExclamation size={100} stroke={1} color="red" />

        {/* 3. Main Heading */}
        <h1 className="md:text-3xl text-lg font-extrabold text-gray-900 dark:text-gray-100 my-3">
          Invitation Expired ⏳
        </h1>
        <Text c="dimmed" className="max-w-md md:text-lg text-sm">
          Please reach out to the organization administrator who sent you the
          invite for a new one.
        </Text>
      </div>
    );
  }

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2, color: "rgba(0, 0, 0, 0.25)" }}
      />

      <form
        className="space-y-5 p-8 max-w-lg w-lg"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Box>
          <Text fw="bold" size="lg">
            Sign Up and Accept Invitation
          </Text>

          <Text c="dimmed" size="sm" mt="xs">
            You've been invited by{" "}
            <strong>{`${invitation.inviter.firstName} ${invitation.inviter.lastName}`}</strong>{" "}
            to create an account for{" "}
            <strong>{invitation.organization.name}</strong>.
          </Text>
        </Box>
        {error && (
          <Alert variant="filled" color="red">
            {error}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            withAsterisk
            label="First Name"
            required
            size="md"
            placeholder="Mark"
            {...form.getInputProps("firstName")}
          />

          <TextInput
            withAsterisk
            label="Last Name"
            required
            size="md"
            placeholder="Doe"
            {...form.getInputProps("lastName")}
          />
        </SimpleGrid>

        <PasswordInput
          withAsterisk
          required
          leftSection={<IconLock size={15} />}
          label="Password"
          size="md"
          {...form.getInputProps("password")}
        />
        <Button fullWidth type="submit" size="md" loading={visible} mt="lg">
          Accept Invitation
        </Button>
      </form>
    </Center>
  );
}
