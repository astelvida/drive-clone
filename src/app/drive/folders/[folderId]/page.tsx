import { getFolderContents } from "@/db/utils";
import { auth } from "@clerk/nextjs/server";
import { FileGrid } from "@/components/drive/file-grid";
import { notFound } from "next/navigation";

export default async function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
  const { userId } = await auth();
  const { folderId } = await params;

  const contents = await getFolderContents(parseInt(folderId), userId!);

  if (!contents) {
    notFound();
  }

  console.log(contents);

  console.log(userId);

  return <FileGrid contents={contents} />;
}
