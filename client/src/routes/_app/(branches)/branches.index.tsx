import { organization } from "@/lib/auth";
import { FULL_HEIGHT } from "@/lib/constant";
import { Button, Center, Loader, Select, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/(branches)/branches/")({
  component: RouteComponent,
  loader: async () => {
    const invitations = await organization.listUserInvitations();
    const branches = await organization.list();

    return { invitations, branches };
  },
  pendingComponent: () => (
    <Center h={FULL_HEIGHT}>
      <Loader />
    </Center>
  ),
  head: () => ({ meta: [{ title: "Branches" }] }),
  staticData: {
    breadcrumbs: [{ order: 1, title: "Branches", to: "#", active: true }],
  },
});

function RouteComponent() {
  const { invitations, branches } = Route.useLoaderData();

  const form = useForm({
    initialValues: {
      email: "",
      role: "member",
      organizationId: "",
    },
    validate: {
      email: isNotEmpty("Required"),
      role: isNotEmpty("Required"),
      organizationId: isNotEmpty("Required"),
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    await organization.inviteMember({
      email: values.email,
      role: values.role as "admin" | "member" | "owner",
      organizationId: values.organizationId,
    });
  };

  return (
    <div>
      <form onSubmit={form.onSubmit(onSubmit)} className="w-lg">
        <TextInput
          label="Email"
          type="email"
          {...form.getInputProps("email")}
        />

        <Select
          label="Role"
          allowDeselect={false}
          data={[
            {
              value: "member",
              label: "Member",
            },
            {
              value: "admin",
              label: "Admin",
            },
          ]}
          {...form.getInputProps("role")}
        />

        <Select
          label="Branch"
          data={
            branches?.data?.map((branch) => ({
              value: branch.id,
              label: branch.name,
            })) || []
          }
          {...form.getInputProps("organizationId")}
        />

        <Button type="submit" mt="md">
          Invite
        </Button>
      </form>

      {invitations?.data?.map((branch) => (
        <Button
          key={branch.id}
          onClick={async () => {
            await organization.acceptInvitation({ invitationId: branch.id });
            window.location.reload();
          }}
        >
          {branch.email} accept
        </Button>
      ))}
    </div>
  );
}
