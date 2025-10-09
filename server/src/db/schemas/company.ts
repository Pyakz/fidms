import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";

export const company = pgTable("company", {
  id: uuid()
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name"),
  webUrl: text("web_url"),
  logo: text("logo"),
  address: text("address"),
  phone: text("phone"),
});

export const companyUpdateSchema = createUpdateSchema(company);
