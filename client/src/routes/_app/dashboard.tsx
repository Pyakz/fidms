import { useSession } from "@/lib/auth";
import { Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, error } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data?.user) {
    return <div>Access Denied</div>;
  }
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="border-2 border-indigo-600 h-23">2</div>
      <div className="border-2 border-indigo-600 h-23">3</div>
      <div className="border-4 border-indigo-600 h-23">4</div>
      <div className="border-8 border-indigo-600 h-23">5</div>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
      <Paper withBorder className="col-span-1 h-36 p-3">
        Paper
      </Paper>
    </div>
  );
}
