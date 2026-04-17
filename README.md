<<<<<<< HEAD
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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 493bc64d5deffc19f1f414b4b91361812849a819
