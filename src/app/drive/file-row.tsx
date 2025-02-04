"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserCircle2Icon, DownloadIcon, TrashIcon, FolderIcon, LinkIcon, StarIcon } from "lucide-react";
import { formatLastModified, downloadFile, formatFileSize, shareFile } from "@/lib/utils";
import { type FileTable, type FolderTable } from "@/db/schema";
import { deleteFile } from "@/app/actions";
import { useRouter } from "next/navigation";
import { getFileIcon } from "./get-file-icon";

type DocRowProps = {
  docData: FileTable & FolderTable;
  userName: string | undefined;
};

export const FileRow = ({ docData, userName }: DocRowProps) => {
  const router = useRouter();
  const isFile = Boolean(docData.type);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteFile(docData.id);
    setIsDeleting(false);
  }

  const handleDownload = () => isFile && downloadFile(docData.url, docData.name);
  const handleShare = () => isFile && shareFile(docData.url);

  const renderActionBar = () => {
    return (
      <div className="flex items-center gap-2 bg-white border-b px-4 py-2">
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon">
            <StarIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <DownloadIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <TableRow
      className={`group ${isFile ? "cursor-pointer hover:bg-gray-100" : ""} ${
        isDeleting ? "bg-slate-40/50 animate-pulse cursor-not-allowed" : ""
      }`}
      onClick={() => !isFile && router.push(`/drive/folders/${docData.id}`)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          {isFile ? getFileIcon(docData.type) : <FolderIcon className="h-6 w-6 text-slate-700" />}
          {docData.name}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <UserCircle2Icon className="h-4 w-4" />
          <span>{userName}</span>
        </div>
      </TableCell>

      <TableCell>
        <span className="text-xs text-gray-500">{isFile ? docData.type : "folder"}</span>
      </TableCell>
      <TableCell>
        <span className="text-xs text-gray-500">{isFile ? formatFileSize(docData.size) : "—"}</span>
      </TableCell>
      <TableCell>{formatLastModified(docData.updatedAt)}</TableCell>
      <TableCell>{renderActionBar()}</TableCell>
    </TableRow>
  );
};
