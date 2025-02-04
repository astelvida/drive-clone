import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl">
          Welcome to Drive Clone
        </h1>
        <p className="mx-auto mb-8 max-w-[600px] text-lg text-slate-300 sm:text-xl">
          A secure cloud storage solution for all your files. Store, share, and access your files from
          anywhere.
        </p>

        <SignInButton mode="modal">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </SignInButton>

        <Link href="/sign-in">
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
