import { db } from "./index";
import { files_table, folders_table } from "./schema";
import { eq, and, desc, isNotNull, isNull } from "drizzle-orm";
import type { NewFileTable, NewFolderTable } from "./schema";

// File operations
export async function createFile(file: NewFileTable) {
  try {
    const [newFile] = await db.insert(files_table).values(file).returning();
    return newFile;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
}

export async function getFilesByFolderId(folderId: number, userId: string) {
  try {
    return await db
      .select()
      .from(files_table)
      .where(and(eq(files_table.parentId, folderId), eq(files_table.userId, userId)))
      .orderBy(desc(files_table.createdAt));
  } catch (error) {
    console.error("Error fetching files:", error);
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

export async function getFoldersByParentId(parentId: number | null, userId: string) {
  try {
    return await db
      .select()
      .from(folders_table)
      .where(and(eq(folders_table.parentId, parentId), eq(folders_table.userId, userId)))
      .orderBy(desc(folders_table.createdAt));
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
}

export async function deleteFolder(id: string, userId: string) {
  try {
    // First delete all files in the folder
    await db
      .delete(files_table)
      .where(and(eq(files_table.parentId, id), eq(files_table.userId, userId)));

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

// Combined operations
export async function getFolderContents(folderId: number, userId: string) {
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

export async function getRootFolder(userId: string) {
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

export async function onboardUser(userId: string) {
  try {
    const driveFolder = await createFolder({
      name: "Drive",
      parentId: null,
      userId: userId,
    });
    const rootFolderId = driveFolder.id;

    const defaultFolders = [
      {
        name: "Recents",
        parentId: rootFolderId,
        userId: userId,
      },

      {
        name: "Trash",
        parentId: rootFolderId,
        userId: userId,
      },
      {
        name: "Starred",
        parentId: rootFolderId,
        userId: userId,
      },
    ];

    const subFolders = await Promise.all(defaultFolders.map((folder) => createFolder(folder)));

    await createFolder({
      name: "Documents",
      parentId: subFolders[0].id,
      userId: userId,
    });

    return rootFolderId;
  } catch (error) {
    console.error("Error onboarding user:", error);
    throw error;
  }
}
