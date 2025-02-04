"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";

export function UploadFile(props: { folderId: number }) {
  const router = useRouter();

  console.log("FOLDER ID", props.folderId);

  return (
    <UploadButton
      input={{ folderId: props.folderId }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("FILES UPLOADED: ", res);
        alert("Upload Completed");
        router.refresh();
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        console.error("UPLOAD ERROR: ", error);
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
