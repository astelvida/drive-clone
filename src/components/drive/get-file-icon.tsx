import {
  FileIcon,
  FileMusicIcon,
  ArchiveIcon,
  TableIcon,
  SheetIcon,
  MailIcon,
  PresentationIcon,
  FileTextIcon,
  FileCode2Icon,
  NotebookIcon,
  FileImageIcon,
  FileVideo2Icon,
  FileQuestionIcon,
} from "lucide-react";

// ... existing code ...

export const getFileIcon = (mimeType: string | null) => {
  if (!mimeType) return <FileIcon fill="none" className="h-6 w-6 text-gray-500" />;

  switch (true) {
    // Documents & Text
    case /^text\/(plain|markdown|rtf)/.test(mimeType):
    case /^application\/(msword|vnd.openxmlformats-officedocument.wordprocessingml|rtf)/.test(
      mimeType
    ):
      return <FileTextIcon className="h-6 w-6 text-blue-500" />;

    // Spreadsheets add numbera csv
    case /(xls|xlsx|csv|numbers|xlsm|xlsb|xlt|xltx|xltm|ods|tsv|dif|sylk|pages)/.test(mimeType):
      return <SheetIcon fill="green" className="h-6 w-6 text-emerald-500" />;

    // Presentations
    case /(powerpoint|presentationml|pptx|pptm|ppt|slides)/.test(mimeType):
      return <PresentationIcon className="h-6 w-6 text-yellow-500" />;

    // Images
    case /^image\//.test(mimeType):
      return <FileImageIcon className="h-6 w-6 text-rose-400" />;

    // Videos
    case /^video\//.test(mimeType):
      return <FileVideo2Icon fill="lightgray" className="h-6 w-6 text-red-500" />;

    // Audio
    case /^audio\//.test(mimeType):
      return <FileMusicIcon className="h-6 w-6 text-purple-500" />;

    // PDFs
    case /^application\/pdf/.test(mimeType):
      return <FileTextIcon className="h-6 w-6 text-white fill-red-500" />;

    // Archives
    case /^application\/(zip|x-rar-compressed|x-7z-compressed|x-tar|x-gzip)/.test(mimeType):
      return <ArchiveIcon className="h-6 w-6 text-amber-500" />;

    // Code files
    case /(javascript|typescript|php|python|java|ruby|swift|jsx|tsx|ts|html|css)/.test(mimeType):
    case /^application\/(json|xml)/.test(mimeType):
      return <FileCode2Icon className="h-6 w-6 text-blue-700" />;

    // Database files
    case /(sql|x-sqlite3|x-mysql|x-sqlite|x-sqlite2|postgres|postgresql)/.test(mimeType):
      return <TableIcon className="h-6 w-6 text-blue-400" />;

    // Email files
    case /^message\/rfc822/.test(mimeType):
    case /(vnd.ms-outlook|x-mbox)/.test(mimeType):
      return <MailIcon className="h-6 w-6 text-sky-500" />;

    // Notes & Rich Text
    case /(rtf|x-notes)/.test(mimeType):
      return <NotebookIcon className="h-6 w-6 text-amber-400" />;

    // Default file icon for unknown types
    default:
      return <FileQuestionIcon className="h-6 w-6 text-gray-500" />;
  }
};

// ... existing code ...
