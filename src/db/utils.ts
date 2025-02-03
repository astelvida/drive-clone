import { db } from "./index";
import { files, folders } from "./schema";
import { eq, and, desc } from "drizzle-orm";
import type { NewFile, NewFolder } from "./schema";

// File operations
export async function createFile(file: NewFile) {
  try {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

export async function getFilesByFolderId(
  folderId: string | null,
  userId: string
) {
  try {
    return await db
      .select()
      .from(files)
      .where(and(eq(files.folderId, folderId), eq(files.userId, userId)))
      .orderBy(desc(files.createdAt));
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

export async function deleteFile(id: string, userId: string) {
  try {
    const [deletedFile] = await db
      .delete(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning();
    return deletedFile;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Folder operations
export async function createFolder(folder: NewFolder) {
  try {
    const [newFolder] = await db.insert(folders).values(folder).returning();
    return newFolder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

export async function getFoldersByParentId(
  parentId: string | null,
  userId: string
) {
  try {
    return await db
      .select()
      .from(folders)
      .where(and(eq(folders.parentId, parentId), eq(folders.userId, userId)))
      .orderBy(desc(folders.createdAt));
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
}

export async function deleteFolder(id: string, userId: string) {
  try {
    // First delete all files in the folder
    await db
      .delete(files)
      .where(and(eq(files.folderId, id), eq(files.userId, userId)));

    // Then delete all subfolders recursively
    const subfolders = await getFoldersByParentId(id, userId);
    for (const subfolder of subfolders) {
      await deleteFolder(subfolder.id, userId);
    }

    // Finally delete the folder itself
    const [deletedFolder] = await db
      .delete(folders)
      .where(and(eq(folders.id, id), eq(folders.userId, userId)))
      .returning();

    return deletedFolder;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}

// Combined operations
export async function getFolderContents(
  folderId: string | null,
  userId: string
) {
  try {
    const [foldersList, filesList] = await Promise.all([
      getFoldersByParentId(folderId, userId),
      getFilesByFolderId(folderId, userId),
    ]);

    return {
      folders: foldersList,
      files: filesList,
    };
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    throw error;
  }
}
