import { Hono } from "hono";
import { type AuthType, auth } from "@server/auth";
import dbClient from "@server/db";
import company from "./company";
import inventory from "./inventory";
import authMiddleware from "@server/middlewares/auth";

const api = new Hono<{ Variables: AuthType }>()
  .on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw))
  .get("/invitation/:id", async (c) => {
    const { id } = c.req.param();
    const existingInvitation = await dbClient.query.invitation.findFirst({
      where: (invitation, { eq, and }) =>
        and(eq(invitation.id, id), eq(invitation.status, "pending")),
      with: {
        organization: true,
        inviter: true,
      },
    });

    if (!existingInvitation) {
      return c.json({ error: "Invitation not found" }, 404);
    }

    return c.json({ invitation: existingInvitation }, 200);
  })

  // Auth Middleware will only work on routes defined after this line
  .use(authMiddleware())
  .route("/inventory", inventory)
  .route("/company", company);

export default api;
