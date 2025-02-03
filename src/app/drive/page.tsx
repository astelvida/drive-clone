import { UserButton } from "@clerk/nextjs";

export default function DrivePage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-2xl font-semibold">My Drive</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4">
          <nav className="space-y-2">
            <div className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
              My Files
            </div>
            <div className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Shared with me
            </div>
            <div className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Starred
            </div>
            <div className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Trash
            </div>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* File grid will go here */}
            <div className="rounded-lg border p-4 hover:border-blue-500">
              <p className="text-sm font-medium">No files yet</p>
              <p className="text-xs text-gray-500">
                Upload your first file to get started
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
