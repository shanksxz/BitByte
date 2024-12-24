import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { comments } from "./comments";
import { posts } from "./posts";
import { commentUpvotes, postUpvotes } from "./upvotes";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 255 }).notNull(),
  email: text("email", { length: 255 }).unique().notNull(),
  emailVerified: text("email_verified", { length: 255 }).notNull(),
  password: text("password", { length: 255 }).notNull(),
  image: text("image", { length: 255 }).default(""),
  createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
  updatedAt: text("updated_at", { length: 255 }).default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" }).notNull(),
  token: text("token", { length: 255 }).unique().notNull(),
  expiresAt: text("expires_at", { length: 255 }).notNull(),
  ipAddress: text("ip_address", { length: 255 }).notNull(),
  userAgent: text("user_agent", { length: 255 }).notNull(),
  createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
  updatedAt: text("updated_at", { length: 255 }).default(sql`(current_timestamp)`),
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer("user_id", { mode: "number" }).notNull(),
    accountId: text("account_id", { length: 255 }).notNull(),
    providerId: text("provider", { length: 255 }).notNull(),
    accessToken: text("access_token", { length: 255 }),
    refreshToken: text("refresh_token", { length: 255 }),
    accessTokenExpiresAt: text("access_token_expires_at"),
    refreshTokenExpiresAt: text("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
    updatedAt: text("updated_at", { length: 255 }).default(sql`(current_timestamp)`),
  },
  (table) => ({
    uniqProviderAccount: unique().on(table.providerId, table.accountId),
  }),
);

export const verifications = sqliteTable(
  "verifications",
  {
    id: text("id", { length: 255 }).primaryKey(),
    identifier: text("identifier", { length: 255 }).notNull(),
    value: text("value", { length: 255 }).notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
    updatedAt: text("updated_at", { length: 255 }).default(sql`(current_timestamp)`),
  },
  (table) => ({
    uniqIdentifierValue: unique().on(table.identifier, table.value),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  posts: many(posts, { relationName: "author" }),
  comments: many(comments, { relationName: "author" }),
  postUpvotes: many(postUpvotes, {
    relationName: "postUpvotes",
  }),
  commentUpvotes: many(commentUpvotes, {
    relationName: "commentUpvotes",
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
