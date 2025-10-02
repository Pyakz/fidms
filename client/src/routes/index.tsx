import { createFileRoute } from "@tanstack/react-router";
import beaver from "@/assets/beaver.svg";
import { honoClient } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mutate: sendRequest } = useMutation({
    mutationFn: async () => {
      try {
        const res = await honoClient.api.inventory.$get();
        if (!res.ok) {
          console.log("Error fetching data");
          return;
        }
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a
        href="https://github.com/stevedylandev/bhvr"
        target="_blank"
        rel="noopener"
      >
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={() => sendRequest()}>Call API</Button>
        <Button variant="secondary" asChild>
          <a target="_blank" href="https://bhvr.dev" rel="noopener">
            Docs
          </a>
        </Button>
      </div>
    </div>
  );
}

export default Index;
