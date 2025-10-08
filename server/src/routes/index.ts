import { Hono } from "hono";
import inventory from "./inventory";
import { type AuthType, auth } from "@server/auth";
import dbClient from "@server/db";

const api = new Hono<{ Bindings: AuthType }>()
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
  .route("/inventory", inventory);

export default api;
