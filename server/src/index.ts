import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { poweredBy } from "hono/powered-by";
import api from "./routes";
// import { sentry } from "@hono/sentry";

const app = new Hono()
  .use(logger())
  .use(trimTrailingSlash())
  .use(poweredBy({ serverName: "FIDMS Server" }))
  // .use("*", sentry())
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/api", api);

if (process.env.NODE_ENV === "production") {
  app
    .use("*", serveStatic({ root: "./static" }))
    .get("*", serveStatic({ root: "./static", path: "index.html" }));
} else {
  app.get("*", (c) => c.text("Development mode: No static files served"));
}

// .use("*", serveStatic({ root: "./static" }))
// .get("*", serveStatic({ root: "./static", path: "index.html" }));

export type AppType = typeof api;
export default app;
