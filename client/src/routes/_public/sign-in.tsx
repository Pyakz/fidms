import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Box,
  Button,
  Center,
  Divider,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { IconLock, IconMail } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { signIn } from "@/lib/auth";
import { BETTER_AUTH_ERROR_CODES } from "@/lib/enums";
import GoogleLogo from "@/components/GoogleLogo";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import { sessionQuery } from "@/lib/queryOptions";

export const Route = createFileRoute("/_public/sign-in")({
  // check if user is already logged in, if so redirect to dashboard
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery);
    if (session.data?.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
    return { session };
  },
  validateSearch: z.object({
    redirect: z.string().catch("").optional().nullable(),
  }),
  component: SignIn,
  head: () => ({
    meta: [
      {
        title: "FIDMS - Flexible Intelligent Dealership Management System",
      },
      {
        name: "description",
        content: "FIDMS - Flexible Intelligent Dealership Management System",
      },
    ],
  }),
});

function SignIn() {
  const [visible, { open, close }] = useDisclosure(false);
  const [visibleGoogle, { open: openGoogle, close: closeGoogle }] =
    useDisclosure(false);

  const { redirect } = Route.useSearch();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: isNotEmpty("Required"),
      password: isNotEmpty("Required"),
    },
  });

  const handleSubmit = (values: typeof form.values) =>
    signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: redirect || `${window.location.origin}/dashboard`,
      },
      {
        onRequest: open,
        onResponse: close,
        onError: (ctx) => {
          if (ctx.error) {
            const errorFieldMap: Record<string, "email" | "password"> = {
              [BETTER_AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED]: "email",
              [BETTER_AUTH_ERROR_CODES.USER_NOT_FOUND]: "email",
              [BETTER_AUTH_ERROR_CODES.INVALID_EMAIL]: "email",
              [BETTER_AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD]: "password",
              [BETTER_AUTH_ERROR_CODES.INVALID_PASSWORD]: "password",
              [BETTER_AUTH_ERROR_CODES.FAILED_TO_CREATE_SESSION]: "password",
            };
            const field = errorFieldMap[ctx.error.code];
            if (field) {
              form.setFieldError(field, ctx.error.message);
            }
          }
        },
      }
    );

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form className="space-y-3 md:p-5" onSubmit={form.onSubmit(handleSubmit)}>
        <Box>
          <Text fw="bold" size="lg">
            Sign In
          </Text>
          <Text c="dimmed" fz="sm">
            Enter your email below to login to your account
          </Text>
        </Box>
        <TextInput
          withAsterisk
          leftSection={<IconMail size={15} />}
          label="Email"
          required
          type="email"
          placeholder="mark@example.com"
          {...form.getInputProps("email")}
        />
        <Box className="space-y-2">
          <PasswordInput
            withAsterisk
            leftSection={<IconLock size={15} />}
            label="Password"
            {...form.getInputProps("password")}
          />
          <Link
            to="/forgot-password"
            className="text-sm"
            style={{ textDecoration: "none" }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button fullWidth type="submit" loading={visible}>
          Login
        </Button>
        <Divider label="Or continue with" />

        <Button
          fullWidth
          variant="default"
          leftSection={<GoogleLogo />}
          loading={visibleGoogle}
          onClick={() =>
            signIn.social(
              {
                provider: "google",
                callbackURL: `${window.location.origin}${redirect || "/dashboard"}`,
              },
              {
                onRequest: openGoogle,
                onResponse: closeGoogle,
                onError: closeGoogle,
                onSuccess: closeGoogle,
              }
            )
          }
        >
          Sign up with Google
        </Button>

        <Text c="dimmed" size="sm" className="text-center">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold"
            style={{ textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </Text>
      </form>
    </Center>
  );
}
