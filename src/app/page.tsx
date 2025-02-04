import { SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl">
              Welcome to Drive Clone
            </h1>
            <p className="mx-auto mb-8 max-w-[600px] text-lg text-slate-300 sm:text-xl">
              A secure cloud storage solution for all your files. Store, share, and access your files from
              anywhere.
            </p>

            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/drive">
                Get Started
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/drive">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Go to Drive
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}
