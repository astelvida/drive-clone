"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  UserCircle2,
  ChevronUp,
  Download,
  Users,
  Trash,
  FileIcon,
  FolderIcon,
  LinkIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
interface FileGridProps {
  contents: {
    folders: Array<{
      id: number;
      name: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    files: Array<{
      id: number;
      name: string;
      size: number;
      type: string;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

export function FileGrid({ contents }: FileGridProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Format file size to human readable format
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Handle item selection
  const toggleSelection = (id: number) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const renderActionBar = () => {
    if (selectedItems.size === 0) return null;

    return (
      <div className="flex items-center gap-2 bg-white border-b px-4 py-2">
        <span className="text-sm">{selectedItems.size} selected</span>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon">
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {renderActionBar()}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="cursor-pointer">
              <div className="flex items-center gap-1">
                Last modified
                <ChevronUp className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>File size</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/drive/folders/${folder.id}`}
              passHref
              legacyBehavior
              prefetch={false}
            >
              <TableRow className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedItems.has(folder.id)}
                    onCheckedChange={() => toggleSelection(folder.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4 text-gray-500" />
                    {folder.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <UserCircle2 className="h-4 w-4" />
                    <span>me</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </Link>
          ))}
          {contents.files.map((file) => (
            <TableRow key={file.id} className="group">
              <TableCell>
                <Checkbox
                  checked={selectedItems.has(file.id)}
                  onCheckedChange={() => toggleSelection(file.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-gray-500" />
                  {file.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <UserCircle2 className="h-4 w-4" />
                  <span>me</span>
                </div>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
