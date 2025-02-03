import { getRootFolder, onboardUser } from "@/db/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DrivePage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found, should be redirected to sign in");
  }

  const rootFolder = await getRootFolder(userId!);

  let rootFolderId = rootFolder?.id;
  if (!rootFolderId) {
    rootFolderId = await onboardUser(userId!);
  }

  return redirect(`/drive/folders/${rootFolderId}`);
}
