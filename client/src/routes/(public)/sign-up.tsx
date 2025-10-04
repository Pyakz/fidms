import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { IconLock, IconMail } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { signIn, signUp } from "@/lib/auth";
import { BETTER_AUTH_ERROR_CODES } from "@/lib/enums";
import GoogleLogo from "@/components/GoogleLogo";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/(public)/sign-up")({
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [visible, { open, close }] = useDisclosure(false);
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
        callbackURL: `${window.location.origin}/dashboard`,
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
        onSuccess: () => navigate({ to: "/dashboard" }),
      }
    );

  return (
    <Center className="h-screen">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form className="space-y-3 p-5" onSubmit={form.onSubmit(handleSubmit)}>
        <Box>
          <Text fw="bold" size="lg">
            Sign Up
          </Text>
          <Text c="dimmed" fz="sm">
            Enter your information to create an account
          </Text>
        </Box>

        <Group grow>
          <TextInput
            withAsterisk
            label="First Name"
            required
            placeholder="Mark"
            {...form.getInputProps("firstName")}
          />

          <TextInput
            withAsterisk
            label="Last Name"
            required
            placeholder="Doe"
            {...form.getInputProps("lastName")}
          />
        </Group>

        <TextInput
          withAsterisk
          leftSection={<IconMail size={15} />}
          label="Email"
          required
          type="email"
          placeholder="mark@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          leftSection={<IconLock size={15} />}
          label="Password"
          {...form.getInputProps("password")}
        />
        <Button fullWidth type="submit">
          Create Account
        </Button>
        <Divider label="Or continue with" />

        <Button
          fullWidth
          variant="default"
          leftSection={<GoogleLogo />}
          onClick={async () => {
            await signIn.social(
              {
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
              },
              {
                onRequest: open,
                onResponse: close,
              }
            );
          }}
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

export default SignUp;
