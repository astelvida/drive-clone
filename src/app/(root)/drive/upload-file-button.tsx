"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export function UploadFileButton({ folderId }: { folderId: number }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const timer = setTimeout(() => setProgress(66), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <UploadButton
        input={{ folderId }}
        endpoint="imageUploader"
        onUploadBegin={(fileName) => {
          console.log("UPLOAD BEGIN", fileName);
        }}
        onUploadProgress={(progress: number) => {
          setProgress(progress);
          console.log("UPLOAD PROGRESS", progress);
        }}
        onClientUploadComplete={(res) => {
          router.refresh();
        }}
        onUploadError={(error: Error) => {
          console.error("UPLOAD ERROR: ", error);
        }}
      />
      <Progress value={progress} className="w-[60%]" />
    </div>
  );
}
