import { SignedOut, SignedIn, SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

const Navbar = async () => {
  const docsLinks = [
    {
      name: "React Docs",
      url: "https://react.dev",
    },
    {
      name: "Next.js Docs",
      url: "https://nextjs.org/docs",
    },
    {
      name: "TypeScript Docs",
      url: "https://www.typescriptlang.org/docs",
    },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">Drive Clone</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Documentation Links */}
          {docsLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"
            >
              <span>{link.name}</span>
              <ExternalLink size={14} />
            </a>
          ))}

          {/* GitHub Link */}
          <a
            href="https://github.com/yourusername/drive-clone"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary"
          >
            <Github size={18} />
          </a>

          {/* Auth Button */}
          <div className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/drive">
                <Button variant="outline" size="sm">
                  Sign In NOW BABY
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/drive">
                <Button variant="outline" size="sm">
                  Drive
                </Button>
              </Link>
              <SignOutButton />
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
