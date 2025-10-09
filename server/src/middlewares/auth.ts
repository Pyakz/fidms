import { createMiddleware } from "hono/factory";
import { type AuthType, auth } from "@server/auth";

const authMiddleware = () =>
  createMiddleware<{ Variables: AuthType }>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return c.json({ error: "Unauthorized", status: 401 }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

export default authMiddleware;
