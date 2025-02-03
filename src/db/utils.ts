import { db } from "./index";
import { files_table } from "./schema";
import { eq, and } from "drizzle-orm";
import { NewFileTable } from "./schema";

export async function createFile(file: NewFileTable) {
  try {
    const [newFile] = await db.insert(files_table).values(file).returning();
    return newFile;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

export async function getFilesByUserId(userId: string) {
  try {
    return await db.query.files.findMany({
      where: eq(files_table.userId, userId),
      orderBy: files_table.createdAt,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

export async function getFilesByParentId(
  parentId: string | null,
  userId: string
) {
  try {
    return await db.query.files.findMany({
      where: and(
        eq(files_table.parentId, parentId),
        eq(files_table.userId, userId)
      ),
      orderBy: files_table.createdAt,
    });
  } catch (error) {
    console.error("Error fetching files by parent:", error);
    throw error;
  }
}

export async function deleteFile(id: string, userId: string) {
  try {
    const [deletedFile] = await db
      .delete(files_table)
      .where(and(eq(files_table.id, id), eq(files_table.userId, userId)))
      .returning();
    return deletedFile;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
