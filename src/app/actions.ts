"use server";

import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { files_table } from "@/db/schema";

const utApi = new UTApi();

export const deleteFile = async (fileId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized : user not authenticated");
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.userId, userId)));

  if (!file) {
    throw new Error("File not found");
  }

  const deletedFile = await db.delete(files_table).where(eq(files_table.id, fileId));

  // if (!deletedFile) {
  //   throw new Error("Failed to delete file");
  // }

  // https://utfs.io/f/

  console.log(deletedFile);

  const deletedUpload = await utApi.deleteFiles([file.url.split("/").pop()!]);

  // if (!deletedUpload) {
  //   throw new Error("Failed to delete file");
  // }

  console.log(deletedUpload);
  // revalidatePath(`/folder/${file.parent}`);

  const cookiesStore = await cookies();

  cookiesStore.set("force-refresh", JSON.stringify(Math.random()));

  return {
    success: true,
  };
};
