import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const inventory = pgTable("inventory", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  vin: text("vin").notNull(),
});
