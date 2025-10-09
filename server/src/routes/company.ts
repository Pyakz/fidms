import type { AuthType } from "@server/auth";
import dbClient from "@server/db";
import { company, companyUpdateSchema } from "@server/db/schemas/company";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { mappedValidationErrors } from "@server/utils";
import { validator } from "hono/validator";
import { StatusCodes } from "http-status-codes";
export const companyRoutes = new Hono<{ Variables: AuthType }>().patch(
  "/me",
  validator("json", (value, c) => {
    const parsed = companyUpdateSchema.safeParse(value);

    if (!parsed.success) {
      return c.json(
        mappedValidationErrors(parsed.error),
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid("json");
    const companyId = c.var.user?.companyId;

    const updated = await dbClient
      .update(company)
      .set(data)
      .where(eq(company.id, companyId!))
      .returning();

    return c.json(updated[0]);
  }
);

export default companyRoutes;
