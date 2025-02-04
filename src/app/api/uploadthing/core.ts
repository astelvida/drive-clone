import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getFolderById } from "@/db/queries";
import { createFile } from "@/db/mutations";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    /**
     * For full list of options and defaults, see the File Route API reference
     * @see https://docs.uploadthing.com/file-routes#route-config
     */
    blob: { maxFileSize: "256MB", maxFileCount: 100 },
  })
    .input(z.object({ folderId: z.number() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { userId } = await auth();
      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      const folder = await getFolderById(input.folderId);

      if (!folder) throw new UploadThingError("Folder not found");

      if (folder.userId !== userId)
        throw new UploadThingError("You are not authorized to upload to this folder");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, parentId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file, ...rest }) => {
      console.log("rest", rest);
      console.log("metadata", metadata);
      console.log("file", file);

      const newFile = await createFile({
        name: file.name,
        type: file.type,
        size: file.size,
        key: file.key,
        url: file.url,
        parentId: metadata.parentId,
        userId: metadata.userId,
      });
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        ...newFile,
      };
    }),

  // .onUploadError(async ({ ...args }) => {
  //   const error = args[0];

  //   console.error("Error uploading file", { args });
  // }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
