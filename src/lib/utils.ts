import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: number) => {
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

export const downloadFile = (url: string, name: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
};

export const shareFile = (url: string) => {
  const shareData = {
    title: "Share File",
    text: "Share File",
    url: url,
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    navigator.clipboard.writeText(url);
  }
};

/**
 * Formats the date as "Mon dd, yyyy".
 *
 * @param date - The date to format.
 * @returns A formatted string.
 * Format date as "Mon dd, yyyy", e.g. "Feb 2, 2025"
 * We use toLocaleDateString with options; you can pass a locale like "en-US" if needed.
 */
export const formatDateShort = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  } as Intl.DateTimeFormatOptions);
};

/**
 * Formats the time as "HH:mm AM/PM".
 *
 * @param date - The date to format.
 * @returns A formatted string.
 */
export const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours.toString().padStart(2, "0");
  hours = hours % 12 || 12;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${formattedHours}:${formattedMinutes} ${suffix}`;
};

/**
 * Formats the modifiedAt timestamp.
 *
 * If the timestamp is from today, returns the time formatted as "HH:mm AM/PM".
 * Otherwise, returns the date formatted as "Mon dd, yyyy".
 *
 * @param modifiedAt - The timestamp string, e.g. "2025-02-03T23:46:06.20"
 * @returns A formatted string.
 */
export function formatLastModified(modifiedAt: Date): string {
  const modDate = new Date(modifiedAt);
  const now = new Date();
  // Check if the modified date is "today"
  if (
    modDate.getFullYear() === now.getFullYear() &&
    modDate.getMonth() === now.getMonth() &&
    modDate.getDate() === now.getDate()
  ) {
    return formatTime(modDate);
  } else {
    return formatDateShort(modDate);
  }
}

// Example usage:
// console.log(formatLastModified("2025-02-04T06:33:52.477Z")); // e.g. "Feb 03, 2025" if not today.
