import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/account(.*)",
  "/friends(.*)",
  "/groups(.*)",
  "/messages(.*)",
  "/watch(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  // matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: ["/((?!.+.[w]+$|_next).*)", "/(api|trpc)(.*)"], // Old
  matcher: [
    "/((?!.+.[w]+$|_next).*)",
    "/(api|trpc)(.*)",

    // New
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/((?!.*\\..*|_next|api/ws).*?)",
    "/(api(?!/ws)|trpc)(.*)",
  ],
};
