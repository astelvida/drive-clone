import { UserButton } from "@clerk/nextjs";
import { SideNav } from "@/components/drive/side-nav";

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-2xl font-semibold">My Drive</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
