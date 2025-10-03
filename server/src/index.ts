import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { poweredBy } from "hono/powered-by";
import api from "./routes";
import { showRoutes } from "hono/dev";
// import { cors } from "hono/cors";
// import { sentry } from "@hono/sentry";

const app = new Hono()
  .use(logger())
  // .use(cors())
  .use(trimTrailingSlash())
  .use(poweredBy({ serverName: "FIDMS Server" }))
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/api", api);

if (process.env.NODE_ENV === "production") {
  app
    .use("*", serveStatic({ root: "./static" }))
    .get("*", serveStatic({ root: "./static", path: "index.html" }));
} else {
  app.get("*", (c) => c.text("Welcome to FIDMS API"));
}

showRoutes(app);
export type AppType = typeof api;

const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
});

console.log(`Server started on http://localhost:${server.port}`);
