"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVerticalIcon,
  UserCircle2Icon,
  DownloadIcon,
  TrashIcon,
  FolderIcon,
  LinkIcon,
  ArrowRightIcon,
  StarIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { downloadFile, formatFileSize, shareFile } from "@/lib/utils";
import Link from "next/link";
import { type FileTable, type FolderTable } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { deleteFile } from "@/app/actions";
import { useRouter } from "next/navigation";
import { getFileIcon } from "./get-file-icon";

type DocRowProps = {
  docData: FileTable & FolderTable;
  userName: string | undefined;
};

export const DocRow = ({ docData, userName }: DocRowProps) => {
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
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="h-4 w-4" />
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
      <TableCell>{formatDistanceToNow(new Date(docData.updatedAt), { addSuffix: true })}</TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {isFile && (
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>{renderActionBar()}</TableCell>
    </TableRow>
  );
};

type FileGridProps = {
  folders: FolderTable[];
  files: FileTable[];
  rootFolder: FolderTable;
  parents: FolderTable[];
};

export function FileGrid({ folders, files, parents }: FileGridProps) {
  const { user } = useUser();

  const userName = user?.fullName || user?.username || user?.emailAddresses[0].emailAddress;

  // console.log("folders", JSON.stringify(folders, null, 2));
  // console.log("files", JSON.stringify(files, null, 2));
  // console.log("parents", JSON.stringify(parents, null, 2));

  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-4">
        {parents.map((parent, index) => (
          <Link
            key={parent.id}
            href={`/drive/folders/${parent.id}`}
            className="flex items-center gap-2"
          >
            {parent.name}
            {index !== parents.length - 1 && <ArrowRightIcon className="h-4 w-4" />}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {renderBreadcrumbs()}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="cursor-pointer">Last modified</TableHead>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[40px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <DocRow
              key={folder.id}
              userName={userName}
              docData={folder as FileTable & FolderTable}
            />
          ))}
          {files.map((file) => (
            <DocRow key={file.id} userName={userName} docData={file as FileTable & FolderTable} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
