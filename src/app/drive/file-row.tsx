"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { DownloadIcon, TrashIcon, FolderIcon, LinkIcon, StarIcon } from "lucide-react";
import { formatLastModified, downloadFile, formatFileSize, shareFile } from "@/lib/utils";
import { type FileTable, type FolderTable } from "@/db/schema";
import { deleteFile } from "@/app/actions";
import { useRouter } from "next/navigation";
import { getFileIcon } from "./get-file-icon";
import Image from "next/image";

type DocRowProps = {
  docData: FileTable & FolderTable;
  modifiedBy: string | undefined;
  userInfo: {
    userName: string | undefined;
    userId: string | undefined;
    userImage: string | undefined;
  };
};

export const FileRow = ({ docData, userInfo, modifiedBy }: DocRowProps) => {
  const router = useRouter();
  const isFile = Boolean(docData.type);
  const [isDeleting, setIsDeleting] = useState(false);

  const { userName, userImage } = userInfo;

  async function handleDelete() {
    setIsDeleting(true);
    await deleteFile(docData.id);
    setIsDeleting(false);
  }

  const handleDownload = () => isFile && downloadFile(docData.url, docData.name);
  const handleShare = () => isFile && shareFile(docData.url);

  const ActionBar = () => {
    // TODO: make these repeatbale components
    return (
      <div className="flex items-center gap-2 opacity-50 hover:opacity-90">
        <div className="flex">
          <Button variant="ghost" size="icon" className="hover:rounded-full">
            <StarIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:rounded-full" onClick={handleDownload}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:rounded-full" onClick={handleShare}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:rounded-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TableRow
      className={`group  hover:bg-slate-100/30 ${isFile ? "cursor-pointer" : ""} ${
        isDeleting ? "bg-slate-300 animate-pulse cursor-not-allowed" : ""
      }`}
      onClick={() => !isFile && !isDeleting && router.push(`/drive/folders/${docData.id}`)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          {isFile ? getFileIcon(docData.type) : <FolderIcon className="h-6 w-6 text-slate-700" />}
          {docData.name}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {userImage ? (
            <Image
              src={userImage || ""}
              alt={userName || "no username"}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="rounded-full bg-indigo-600 w-[24px] h-[24px] flex items-center justify-center">
              <span className="text-gray-100 text-sm">{userName?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="text-xs">{modifiedBy}</span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-500">{isFile ? docData.type : "folder"}</span>
      </TableCell>
      <TableCell>
        <span className="text-xs text-gray-500">{isFile ? formatFileSize(docData.size) : "—"}</span>
      </TableCell>
      <TableCell>{formatLastModified(docData.updatedAt)}</TableCell>
      <TableCell>
        <ActionBar />
      </TableCell>
    </TableRow>
  );
};
