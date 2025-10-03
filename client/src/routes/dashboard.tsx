import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, error } = useSession();

  if (!data?.user) {
    return <div>Access Denied</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      <div>Hello {data.user.name}</div>
      <Button
        onClick={async () => {
          signOut();
        }}
      >
        Signout
      </Button>
    </div>
  );
}
