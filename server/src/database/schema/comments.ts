import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { posts } from "./posts";
import { commentUpvotes } from "./upvotes";

export const comments = sqliteTable("posts", {
  id: integer("id", { mode : "number" }).primaryKey({ autoIncrement : true }),
  userId: text("user_id").notNull(),
  postId: integer("post_id").notNull(),
  parentCommentId: integer("parent_comment_id"),
  content: text("content").notNull(),
  createdAt: text("created_at", { length: 255 }).default(sql`(current_timestamp)`),
  depth: integer("depth").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  points: integer("points").default(0).notNull(),
});

export const commentRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
    relationName: "author",
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "childComments",
  }),
  childComments: many(comments, {
    relationName: "childComments",
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  commentUpvotes: many(commentUpvotes, { relationName: "commentUpvotes" }),
}));
