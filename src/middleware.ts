import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/api/uploadthing(.*)"]);

const isProtectedRoute = createRouteMatcher(["/drive(.*)"]);

// export default clerkMiddleware(async (auth, req, event) => {
//   if (isProtectedRoute(req)) {
//     await auth.protect();
//   }
// });

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // if (!userId && isProtectedRoute(req)) {
  //   return redirectToSignIn();
  // }
});

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   if (!userId && !isPublicRoute(req)) {
//     // Add custom logic to run before redirecting
//     return redirectToSignIn();
//   }
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
