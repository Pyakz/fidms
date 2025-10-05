import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

// Updated user table (already using uuid)
export const user = pgTable("user", {
  // Changed t.uuid() to uuid() for consistency and best practice, assuming it's imported
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

// ---

// Updated session table to use uuid for the primary key
export const session = pgTable("session", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // Note: Since user.id is uuid now, the foreign key userId should match type,
  // but it's currently defined as text in your original snippet.
  // I will keep it as text to match your original foreign key definition
  // but it *should* ideally be uuid("user_id").
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// ---

// Updated account table to use uuid for the primary key
export const account = pgTable("account", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  // Similar foreign key note as above: should ideally be uuid("user_id")
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ---

// Updated verification table to use uuid for the primary key
export const verification = pgTable("verification", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
