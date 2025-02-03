import { getFolderContents } from "@/db/utils";
import { auth } from "@clerk/nextjs/server";
import { FileGrid } from "@/components/drive/file-grid";
import { notFound } from "next/navigation";

export default async function FolderPage({
  params,
}: {
  params: { folderId: string };
}) {
  const { userId } = await auth();
  const contents = await getFolderContents(params.folderId, userId!);

  if (!contents) {
    notFound();
  }

  return <FileGrid contents={contents} />;
}
