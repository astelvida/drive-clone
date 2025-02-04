import { onboardUser } from "@/db/mutations";
import { getRootFolderbyUser } from "@/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DrivePage() {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error("User not found, should be redirected to sign in");
  }

  const rootFolder = await getRootFolderbyUser(userId!);

  let rootFolderId = rootFolder?.id;
  if (!rootFolderId) {
    rootFolderId = await onboardUser(userId);
  }

  return redirect(`/drive/folders/${rootFolderId}`);
}
