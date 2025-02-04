import { db } from "./index";
import { files_table, folders_table } from "./schema";
import { eq, and, desc, isNull } from "drizzle-orm";

export async function getFolderById(folderId: number) {
  const folders = await db.select().from(folders_table).where(eq(folders_table.id, folderId));
  return folders[0];
}

export async function getFoldersByParentId(folderId: number, userId: string) {
  const currentFolders = await db
    .select()
    .from(folders_table)
    .where(and(eq(folders_table.parentId, folderId), eq(folders_table.userId, userId)))
    .orderBy(desc(folders_table.id));

  return currentFolders;
}

export async function getFilesByParentId(folderId: number, userId: string) {
  const currentFiles = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.parentId, folderId), eq(files_table.userId, userId)))
    .orderBy(desc(files_table.id));

  return currentFiles;
}

export async function getRootFolderbyUser(userId: string) {
  try {
    const [rootFolder] = await db
      .select()
      .from(folders_table)
      .where(and(isNull(folders_table.parentId), eq(folders_table.userId, userId)));

    console.log({ rootFolder });
    return rootFolder;
  } catch (error) {
    console.error("Error fetching root folder:", error);
    throw error;
  }
}

export async function getAllParentsForFolder(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folders_table)
      .where(eq(folders_table.id, currentId));

    if (!folder[0]) {
      throw new Error("Parent folder not found");
    }
    parents.unshift(folder[0]);
    currentId = folder[0]?.parentId;
  }
  return parents;
}

export async function getSidebarFolders(userId: string) {
  const folders = await db.select().from(folders_table).where(eq(folders_table.userId, userId));
  return folders;
}
