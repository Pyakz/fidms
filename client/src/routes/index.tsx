import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <div>Home Page</div>,
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
