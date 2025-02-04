"use server";

import { db } from "./index";
import { files_table, folders_table, NewFolderTable, NewFileTable } from "./schema";
import { eq, and } from "drizzle-orm";
import { getFoldersByParentId } from "./queries";

export async function createFile(file: NewFileTable) {
  try {
    const [newFile] = await db.insert(files_table).values(file).returning();
    return newFile;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

// Folder operations
export async function createFolder(folder: NewFolderTable) {
  try {
    const [newFolder] = await db.insert(folders_table).values(folder).returning();
    return newFolder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

export async function onboardUser(userId: string) {
  try {
    const driveFolder = await createFolder({
      name: "Drive",
      parentId: null,
      userId: userId,
    });

    const rootFolderId = driveFolder.id;

    const defaultOnboardFolders = [
      {
        name: "Recents",
        parentId: rootFolderId,
        userId,
      },
      {
        name: "Starred",
        parentId: rootFolderId,
        userId,
      },
      {
        name: "Trash",
        parentId: rootFolderId,
        userId,
      },
    ];

    const [recentsFolder] = await Promise.all(defaultOnboardFolders.map(createFolder));

    await createFolder({
      name: "Documents",
      parentId: recentsFolder.id,
      userId,
    });

    return rootFolderId;
  } catch (error) {
    console.error("Error onboarding user:", error);
    throw error;
  }
}

export async function deleteFile(id: string, userId: string) {
  try {
    const [deletedFile] = await db
      .delete(files_table)
      .where(and(eq(files_table.id, parseInt(id)), eq(files_table.userId, userId)))
      .returning();
    return deletedFile;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function deleteFolder(id: string, userId: string) {
  try {
    // First delete all files in the folder
    await db
      .delete(files_table)
      .where(and(eq(files_table.parentId, parseInt(id)), eq(files_table.userId, userId)));

    // Then delete all subfolders recursively
    const subfolders = await getFoldersByParentId(id, userId);
    for (const subfolder of subfolders) {
      await deleteFolder(subfolder.id.toString(), userId);
    }

    // Finally delete the folder itself
    const [deletedFolder] = await db
      .delete(folders_table)
      .where(and(eq(folders_table.id, parseInt(id)), eq(folders_table.userId, userId)))
      .returning();

    return deletedFolder;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}
