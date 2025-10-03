import { Hono } from "hono";
import inventory from "./inventory";
import { auth, type AuthType } from "@server/auth";

const api = new Hono<{ Bindings: AuthType }>()
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/inventory", inventory);

export default api;
