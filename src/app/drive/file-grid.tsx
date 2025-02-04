import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { type FileTable, type FolderTable } from "@/db/schema";
import { FileRow } from "./file-row";

type FileGridProps = {
  folders: FolderTable[];
  files: FileTable[];
  rootFolder: FolderTable;
  parents: FolderTable[];
  userInfo: {
    userId: string;
    userImage: string;
    userName: string;
  };
};

export function FileGrid({ folders, files, parents, userInfo }: FileGridProps) {
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-4">
        {parents.map((parent, index) => (
          <Link key={parent.id} href={`/drive/folders/${parent.id}`} className="flex items-center gap-2">
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
            <TableHead>Last modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <FileRow
              key={folder.id}
              userInfo={userInfo}
              modifiedBy={folder.userId === userInfo.userId ? "me" : "not me"}
              docData={folder as FileTable & FolderTable}
            />
          ))}
          {files.map((file) => (
            <FileRow
              key={file.id}
              userInfo={userInfo}
              modifiedBy={file.userId === userInfo.userId ? "me" : "not me"}
              docData={file as FileTable & FolderTable}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
