import { pgTable, text, timestamp, bigint, serial, integer, index } from "drizzle-orm/pg-core";

export const folders_table = pgTable(
  "folders_table",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    parentId: integer("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      {
        folders_userId_idx: index("folders_user_id_idx").on(table.userId),
        folders_parent_id_idx: index("folders_parent_id_idx").on(table.parentId),
      },
    ];
  }
);

export const files_table = pgTable(
  "files_table",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    type: text("type").notNull(),
    key: text("key").notNull(),
    parentId: integer("parent_id")
      .notNull()
      .references(() => folders_table.id),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return [
      {
        files_userId_idx: index("files_user_id_idx").on(table.userId),
        files_parent_id_idx: index("files_parent_id_idx").on(table.parentId),
      },
    ];
  }
);

// export const foldersRelations = relations(folders_table, ({ many }) => ({
//   files: many(files_table),

// }));

// export const filesRelations = relations(files_table, ({ one }) => ({
//   folder: one(folders_table, {
//     fields: [files_table.parentId],
//     references: [folders_table.id],
//   }),
// }));

export type FolderTable = typeof folders_table.$inferSelect;
export type NewFolderTable = typeof folders_table.$inferInsert;
export type FileTable = typeof files_table.$inferSelect;
export type NewFileTable = typeof files_table.$inferInsert;
