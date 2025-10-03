import { createFileRoute } from "@tanstack/react-router";
import SignIn from "@/components/ui/sign-in";
import SignUp from "@/components/ui/sign-up";
import { useEffect } from "react";
import { honoClient } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    honoClient.inventory.$get();
  }, []);

  return (
    <div className="flex gap-3 items-center justify-center h-screen">
      <SignIn />
      <SignUp />
    </div>
  );
}

export default Index;
