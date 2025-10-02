import { Hono } from "hono";

export const inventory = new Hono()
  .get("/", (c) => {
    return c.json({ message: "Inventory root" });
  })
  .get("/items", (c) => {
    return c.json({ items: ["item1", "item2", "item3"] });
  })
  .get("/items/:id", (c) => {
    const { id } = c.req.param();
    return c.json({ item: `item with id ${id}` });
  });

export default inventory;
