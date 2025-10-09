import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";

export const company = pgTable("company", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name"),
  webUrl: text("web_url"), // New and Optional
  logo: text("logo"),
});
