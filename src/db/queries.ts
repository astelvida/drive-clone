"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "./index";
import { files_table, folders_table } from "./schema";
import { eq } from "drizzle-orm";
export async function getFilesByFolderId(folderId: number, userId: string) {
  return await db.select().from(files_table).where(eq(files_table.parentId, folderId));
}

export async function getFoldersByParentId(parentId: number, userId: string) {
  return await db.select().from(folders_table).where(eq(folders_table.parentId, parentId));
}

export async function seedDatabase() {
  try {
    const user = await auth();
    if (!user.userId) {
      throw new Error("User not authenticated");
    }

    const userId = user.userId;
    // Create root "My Drive" folder
    const [rootFolder] = await db
      .insert(folders_table)
      .values({
        name: "My Drive",
        parentId: null,
        userId: userId,
      })
      .returning();

    // Create subfolders under root
    const [documentsFolder, photosFolder, workFolder] = await db
      .insert(folders_table)
      .values([
        {
          name: "Documents",
          parentId: rootFolder.id,
          userId: userId,
        },
        {
          name: "Photos",
          parentId: rootFolder.id,
          userId: userId,
        },
        {
          name: "Work Projects",
          parentId: rootFolder.id,
          userId: userId,
        },
      ])
      .returning();

    // Create a nested folder inside Documents
    const [reportsFolder] = await db
      .insert(folders_table)
      .values({
        name: "Reports",
        parentId: documentsFolder.id,
        userId: userId,
      })
      .returning();

    // Add sample files
    await db.insert(files_table).values([
      {
        name: "vacation.jpg",
        path: "/fake/path/vacation.jpg",
        size: 2500000,
        type: "image/jpeg",
        parentId: photosFolder.id,
        userId: userId,
      },
      {
        name: "quarterly_report.pdf",
        path: "/fake/path/quarterly_report.pdf",
        size: 1200000,
        type: "application/pdf",
        parentId: reportsFolder.id,
        userId: userId,
      },
      {
        name: "monthly_report.pdf",
        path: "/fake/path/monthly_report.pdf",
        size: 1200000,
        type: "application/pdf",
        parentId: reportsFolder.id,
        userId: userId,
      },
      {
        name: "project_plan.docx",
        path: "/fake/path/project_plan.docx",
        size: 500000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        parentId: workFolder.id,
        userId: userId,
      },
      {
        name: "project_plan2.docx",
        path: "/fake/path/project_plan2.docx",
        size: 500000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        parentId: workFolder.id,
        userId: userId,
      },
    ]);

    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
