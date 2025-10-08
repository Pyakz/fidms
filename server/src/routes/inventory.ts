import dbClient from "@server/db";
import schema from "@server/db/schema";
import { Hono } from "hono";

export const inventory = new Hono()
  .get("/", async (c) => {
    const newInventoryItem = await dbClient
      .insert(schema.inventory)
      .values({
        vin: `1HGCM82633A123456`,
      })
      .returning({
        id: schema.inventory.id,
        vin: schema.inventory.vin,
      });

    return c.json(newInventoryItem);
  })
  .get("/items", (c) => {
    return c.json({ items: ["item1", "item2", "item3"] });
  })
  .get("/items/:id", (c) => {
    const { id } = c.req.param();
    return c.json({ item: `item with id ${id}` });
  });

export default inventory;
