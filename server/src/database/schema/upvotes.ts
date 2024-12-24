import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { comments } from "./comments";
import { posts } from "./posts";

export const postUpvotes = sqliteTable("upvotes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
});

export const commentUpvotes = sqliteTable("comment_upvotes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  commentId: integer("comment_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
});

export const postUpvoteRelations = relations(postUpvotes, ({ one }) => ({
  post: one(posts, {
    fields: [postUpvotes.postId],
    references: [posts.id],
    relationName: "postUpvotes",
  }),
  user: one(users, {
    fields: [postUpvotes.userId],
    references: [users.id],
    relationName: "user",
  }),
}));

export const commentUpvoteRelations = relations(
  commentUpvotes,
  ({ one }) => ({
    post: one(comments, {
      fields: [commentUpvotes.commentId],
      references: [comments.id],
      relationName: "commentUpvotes",
    }),
    user: one(users, {
      fields: [commentUpvotes.userId],
      references: [users.id],
      relationName: "user",
    }),
  }),
);
