import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  Center,
  Divider,
  LoadingOverlay,
  PasswordInput,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { IconLock, IconMail } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { signIn, signUp } from "@/lib/auth";
import { BETTER_AUTH_ERROR_CODES } from "@/lib/enums";
import GoogleLogo from "@/components/GoogleLogo";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/_public/sign-up")({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [visible, { open, close }] = useDisclosure(false);
  const [visibleGoogle, { open: openGoogle, close: closeGoogle }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: {
      firstName: isNotEmpty("Required"),
      lastName: isNotEmpty("Required"),
      email: isNotEmpty("Required"),
      password: isNotEmpty("Required"),
    },
  });

  const handleSubmit = (values: typeof form.values) =>
    signUp.email(
      {
        name: `${values.firstName} ${values.lastName}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        callbackURL: `${window.location.origin}/setup`,
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
              [BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL]:
                "email",
            };

            const field = errorFieldMap[ctx.error.code];
            if (field) {
              form.setFieldError(field, ctx.error.message);
            }
          }
        },
        onSuccess: (ctx) =>
          navigate({
            to: "/sign-in",
            reloadDocument: true,
            replace: true,
            search: {
              verificationEmailSent: ctx.data?.user?.email || undefined,
            },
          }),
      }
    );

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ blur: 2, color: "rgba(0, 0, 0, 0.25)" }}
      />

      <form
        className="space-y-5 p-8 max-w-lg w-lg"
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Box>
          <Text fw="bold" size="lg">
            Sign Up
          </Text>
          <Text c="dimmed" fz="sm">
            Enter your information to create an account
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
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

        <TextInput
          withAsterisk
          leftSection={<IconMail size={15} />}
          label="Email"
          required
          size="md"
          type="email"
          placeholder="mark@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          size="md"
          leftSection={<IconLock size={15} />}
          label="Password"
          {...form.getInputProps("password")}
        />
        <Button fullWidth type="submit" size="md" loading={visible}>
          Create Account
        </Button>
        <Divider label="Or continue with" />

        <Button
          fullWidth
          variant="default"
          size="md"
          leftSection={<GoogleLogo />}
          loading={visibleGoogle}
          onClick={() =>
            signIn.social(
              {
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
                newUserCallbackURL: `${window.location.origin}/setup`,
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
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-semibold"
            style={{ textDecoration: "none" }}
          >
            Sign In
          </Link>
        </Text>
      </form>
    </Center>
  );
}
