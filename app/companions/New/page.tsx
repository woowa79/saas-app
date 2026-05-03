import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CompanionForm from "@/components/CompanionForm";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";

const NewCompanionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 py-10 lg:w-1/3 md:w-2/3">
      {canCreateCompanion ? (
        <article className="w-full flex flex-col gap-4">
          <h1>Companion Builder</h1>
          <CompanionForm />
        </article>
      ) : (
        <article className="companion-limit">
          <Image
            src="/images/limit.svg"
            alt="Companion limit reached"
            width={360}
            height={230}
          />
          <div className="cta-badge">Upgrade your plan</div>
          <h1>You've Reached Your Limit</h1>
          <p>
            You've reached your companion limit. Upgrade to create more companions and unlock
            premium features.
          </p>
          <Link href="/subscription" className="btn-primary w-full justify-center">
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanionPage;