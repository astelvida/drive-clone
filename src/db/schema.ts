import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const files_table = pgTable("files_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  parentId: uuid("parent_id").references(() => files_table.id),
  isFolder: boolean("is_folder").notNull().default(false),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Relations
export const filesRelations = relations(files_table, ({ self }) => ({
  parent: self.one(files_table, {
    fields: [files_table.parentId],
    references: [files_table.id],
  }),
  children: self.many(files_table, {
    fields: [files_table.id],
    references: [files_table.parentId],
  }),
}));

// Types
export type FileTable = typeof files_table.$inferSelect;
export type NewFileTable = typeof files_table.$inferInsert;
