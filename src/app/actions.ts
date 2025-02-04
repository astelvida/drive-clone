"use server";

import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { files_table } from "@/db/schema";

const utApi = new UTApi();

export const deleteFile = async (fileId: number) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized : user not authenticated");

    // check if file exists - DO WE NEED THIS?
    const [file] = await db
      .select()
      .from(files_table)
      .where(and(eq(files_table.id, fileId), eq(files_table.userId, userId)));
    if (!file) throw new Error("File not found");

    // TODO: make this atomic, if one fails then you have inconsitency bw storage and db
    // delete file from db
    const deletedFile = await db.delete(files_table).where(eq(files_table.id, fileId));
    if (!deletedFile) throw new Error("Failed to delete file");

    // delete file from utfs
    const deletedUpload = await utApi.deleteFiles([file.key]);
    if (!deletedUpload) throw new Error("Failed to delete file");

    // revalidate the parent folder
    const cookiesStore = await cookies();
    cookiesStore.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
