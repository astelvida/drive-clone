import { onboardUser } from "@/db/mutations";
import { getRootFolderbyUser } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DrivePage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found, should be redirected to sign in");
  }

  const rootFolder = await getRootFolderbyUser(userId!);
  console.log({ rootFolder });

  let rootFolderId = rootFolder?.id;
  if (!rootFolderId) {
    rootFolderId = await onboardUser(userId);
  }

  return redirect(`/drive/folders/${rootFolderId}`);
}
