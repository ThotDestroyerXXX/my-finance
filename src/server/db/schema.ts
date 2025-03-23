// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  pgTable,
  text,
  boolean,
  decimal,
  integer,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const transactionType = pgEnum("transaction_type", [
  "Income",
  "Expense",
]);

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
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
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const user_account_type = pgTable("account_type", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
});

export const user_account = pgTable("user_account", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  balance: decimal("balance", { scale: 2 }).notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  currency_type: text("currency_type").notNull(),
  user_account_type_id: integer("user_account_type_id")
    .notNull()
    .references(() => user_account_type.id),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const category = pgTable("category", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  icon_image: text("icon_image").notNull(),
  user_id: text("user_id").references(() => user.id),
});

export const category_budget = pgTable("category_budget", {
  id: text("id").primaryKey(),
  amount_limit: decimal("amount", { scale: 2 }).notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  category_id: integer("category_id")
    .notNull()
    .references(() => category.id),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const monthly_budget = pgTable("monthly_budget", {
  id: text("id").primaryKey(),
  amount_limit: decimal("amount", { scale: 2 }).notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  user_account_id: text("user_account_id")
    .notNull()
    .references(() => user_account.id),
});

export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  amount: decimal("amount", { scale: 2 }).notNull(),
  description: text("description"),
  transaction_date: date("transaction_date").notNull(),
  transaction_type: transactionType("transaction_type").notNull(),
  created_at: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  category_id: integer("category_id")
    .notNull()
    .references(() => category.id),
  user_account_id: text("user_account_id")
    .notNull()
    .references(() => user_account.id),
});
