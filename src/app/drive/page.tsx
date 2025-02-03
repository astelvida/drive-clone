import { getFolderContents } from "@/db/utils";
import { auth } from "@clerk/nextjs";
import { FileGrid } from "@/components/drive/file-grid";

export default async function DrivePage() {
  const { userId } = auth();
  const contents = await getFolderContents(null, userId!);

  return <FileGrid contents={contents} />;
}
