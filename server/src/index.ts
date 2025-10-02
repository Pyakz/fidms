import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { poweredBy } from "hono/powered-by";
import inventory from "./routes/inventory";

const api = new Hono()
  .notFound((c) => c.json({ message: "Not Founds" }, 404))
  .route("/inventory", inventory);

const app = new Hono()
  .use(cors())
  .use(logger())
  .use(trimTrailingSlash())
  .use(poweredBy({ serverName: "FIDMS Server" }))
  .get("/health", (c) => c.json({ status: "ok" }))
  .route("/api", api);

app.use("*", serveStatic({ root: "./static" }));
app.get("*", serveStatic({ root: "./static", path: "index.html" }));

export default app;
export type AppType = typeof app;
