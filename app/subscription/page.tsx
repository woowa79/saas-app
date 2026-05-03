import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For trying voice learning companions.",
    features: ["1 active companion", "Basic voice session", "Community support"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For consistent learners who need more sessions.",
    features: ["Unlimited companions", "Priority voice quality", "Session history insights"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For classrooms and small learning groups.",
    features: ["Up to 10 seats", "Shared companion library", "Team analytics"],
    cta: "Contact Sales",
  },
];

interface SubscriptionPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

const SubscriptionPage = async ({ searchParams }: SubscriptionPageProps) => {
  const params = await searchParams;
  const activeTab = params.tab === "statements" ? "statements" : "subscription";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Pricing</p>
        <h1 className="text-4xl font-bold text-slate-900">Choose your learning plan</h1>
        <p className="text-slate-600">Pick a plan that matches how often you study with companions.</p>
      </section>

      <section className="flex items-center gap-2">
        <Link
          href="/subscription?tab=subscription"
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            activeTab === "subscription" ? "bg-black text-white" : "border border-black text-black"
          }`}
        >
          Subscription
        </Link>
        <Link
          href="/subscription?tab=statements"
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            activeTab === "statements" ? "bg-black text-white" : "border border-black text-black"
          }`}
        >
          Statements
        </Link>
      </section>

      {activeTab === "subscription" ? (
        <section className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border-2 p-6 ${
                plan.highlighted ? "border-black bg-slate-50" : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{plan.name}</p>
              <div className="mt-3 flex items-end gap-1">
                <p className="text-4xl font-black text-slate-900">{plan.price}</p>
                <p className="pb-1 text-sm text-slate-500">{plan.period}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>

              <button className="mt-6 w-full rounded-xl border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                {plan.cta}
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-3xl border-2 border-black bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Statements</h2>
          <p className="mt-2 text-slate-600">Your billing statements will appear here.</p>
        </section>
      )}
    </main>
  );
};

export default SubscriptionPage;