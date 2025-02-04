"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, TrashIcon, HardDriveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { seedDatabase } from "@/db/seed";

const navItems = [
  {
    label: "My Drive",
    href: "/drive",
    icon: HardDriveIcon,
    exact: true,
  },
  {
    label: "Recents",
    href: "/drive/recents",
    icon: ClockIcon,
  },
  {
    label: "Trash",
    href: "/drive/trash",
    icon: TrashIcon,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <Button onClick={() => seedDatabase()}>Seed Database</Button>
      </nav>
    </aside>
  );
}
