import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getAllParentsForFolder,
  getRootFolderbyUser,
  getFoldersByParentId,
  getFilesByParentId,
} from "@/db/queries";
import { notFound } from "next/navigation";
import { FolderIcon } from "lucide-react";
import { UploadFileButton } from "../../upload-file-button";
import { FileGrid } from "../../file-grid";

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
  const { folderId } = await params;
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) return notFound();

  const promises = await Promise.all([
    getFoldersByParentId(parseInt(folderId), userId),
    getFilesByParentId(parseInt(folderId), userId),
    getAllParentsForFolder(parseInt(folderId)),
    getRootFolderbyUser(userId),
  ]);

  const [currentFolders, currentFiles, breadcrumbs, rootFolder] = await Promise.all(promises);

  const userInfo = {
    userId,
    userImage: user?.imageUrl,
    userName:
      user?.username ||
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      user?.emailAddresses[0].emailAddress,
  };

  console.log("userInfo", userInfo);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FolderIcon className="h-4 w-4" />
        <h1 className="text-2xl font-bold">{rootFolder?.name}</h1>

        <UploadFileButton folderId={parseInt(folderId)} />
      </div>
      <FileGrid
        folders={currentFolders}
        files={currentFiles}
        rootFolder={rootFolder}
        parents={breadcrumbs}
        userInfo={userInfo}
      />
    </div>
  );
}
