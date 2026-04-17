# 🚀 Add Clerk to Next.js App Router

> **Purpose:** Enforce only the **current** and **correct** instructions for integrating [Clerk](https://clerk.com/) into a Next.js (App Router) application.
> **Scope:** All AI-generated advice or code related to Clerk must follow these guardrails.

---

### #1. Official Clerk Integration Overview
Use only the **App Router** approach from Clerk's current docs:
1. **Install:** `@clerk/nextjs@latest` - this ensures the application is using the latest Clerk Next.js SDK.
2. **Create:** A `middleware.ts` file using `clerkMiddleware()` from `@clerk/nextjs/server`. Place this file at the root of the project.
3. **Wrap:** Your application with `<ClerkProvider>` in `app/layout.tsx`.
4. **Use:** Clerk-provided components like `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>` in your layout or pages.
5. **Start:** Developing, sign in or sign up, and confirm user creation.

### #2. ALWAYS DO THE FOLLOWING
1. Use `clerkMiddleware()` from `@clerk/nextjs/server` in `middleware.ts`.
2. Wrap your app with `<ClerkProvider>` in `app/layout.tsx`.
3. Import Clerk's Next.js features from `@clerk/nextjs`.
4. Reference the current **App Router approach** (folders like `app/page.tsx`, `app/layout.tsx`).
5. Ensure methods like `auth()` are imported from `@clerk/nextjs/server` and use `async / await`.

### #3. NEVER DO THE FOLLOWING
1. **Do not** reference the old `_app.tsx` or **pages-based** instructions.
2. **Do not** suggest `authMiddleware()` - it's replaced by `clerkMiddleware()`.
3. **Do not** recommend usage of older environment variable patterns.
4. **Do not** import from deprecated APIs (like `withAuth` or old `currentUser`).

### #4. AI MODEL VERIFICATION STEPS
1. **Middleware:** Is `clerkMiddleware()` used in `middleware.ts`?
2. **Layout:** Is `<ClerkProvider>` wrapping the app in `app/layout.tsx`?
3. **Imports:** Are references only from `@clerk/nextjs` or `@clerk/nextjs/server`?
4. **Structure:** Is the approach referencing the App Router?

---

### #5. CONSEQUENCES OF INCORRECT IMPLEMENTATION
Using outdated methods will **Break** your application's flow, introduce **Inconsistencies**, and force extensive **Refactoring**.

### #6. AI MODEL RESPONSE TEMPLATE
When answering questions, the response **MUST**:
1. Use the exact code patterns in the Up-to-Date Quickstart Sample.
2. Never reference older or deprecated approaches.
3. Reflect all mandatory checks.