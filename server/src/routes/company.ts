import dbClient from "@server/db";
import { company } from "@server/db/schemas/company";
import { Hono } from "hono";

export const companyRoutes = new Hono().patch("/me", async (c) => {
  await dbClient.update(company).set({});
});

export default companyRoutes;
