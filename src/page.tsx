import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-pink-500 shadow-xl",
          },
        }}
        forceRedirectUrl="/drive"
      />
    </div>
  );
}
