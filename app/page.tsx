import CompanionsList from "@/components/CompanionsList";
import CompanionCard from "@/components/ui/CompanionCard";
import CTA from "@/components/CTA";
import { getAllCompanions, getRecentsessions } from "@/lib/actions/companion.actions";
import { subjectsColors } from "@/constants";

const getSubjectColor = (subject: string) => {
  const key = subject.toLowerCase() as keyof typeof subjectsColors;
  return subjectsColors[key] ?? "#FFC8E4";
};

const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentsessions(10).catch(() => []);
  const listCompanions = recentSessionsCompanions.length > 0
    ? recentSessionsCompanions
    : companions;

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">Popular Companions</h1>

      <section className="companions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className="home-section mt-10">
        <CompanionsList
          title="Recently completed sessions"
          companions={listCompanions}
          className="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;