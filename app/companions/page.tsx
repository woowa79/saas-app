import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { recentSessions, subjectsColors } from "@/constants";

const getSubjectColor = (subject: string) => {
  const key = subject.trim().toLowerCase() as keyof typeof subjectsColors;
  return subjectsColors[key] ?? "#F3F4F6";
};

const normalizeSubject = (subject: string) => {
  const value = subject.trim().toLowerCase();
  if (value === "unknown") return "coding";
  if (value === "math") return "maths";
  return value;
};

interface CompanionsPageProps {
  searchParams: Promise<{
    name?: string;
    subject?: string;
    topic?: string;
    duration?: string;
    voice?: string;
    style?: string;
  }>;
}

const CompanionsPage = async ({ searchParams }: CompanionsPageProps) => {
  const user = await currentUser();
  const params = await searchParams;
  const companions = await getAllCompanions({ limit: 1, page: 1, subject: "", topic: "" });

  const queryCompanion = params.name
    ? {
        id: "local-query",
        name: params.name,
        subject: params.subject || "coding",
        topic: params.topic || "",
        duration: Number(params.duration || 15),
        bookmarked: false,
        voice: params.voice || "male",
        style: params.style || "formal",
      }
    : null;

  const companion = queryCompanion ?? companions[0] ?? recentSessions[0] ?? null;

  if (!companion) {
    return (
      <section className="flex flex-col gap-8">
        <p className="text-lg text-slate-600">No companion available yet.</p>
      </section>
    );
  }

  const normalizedSubject = normalizeSubject(companion.subject);
  const displaySubject = normalizedSubject;
  const iconSubject = normalizedSubject;

  return (
    <section className="flex flex-col gap-8">
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg"
            style={{ backgroundColor: getSubjectColor(displaySubject) }}
          >
            <Image
              src={`/icons/${iconSubject}.svg`}
              alt={displaySubject}
              width={36}
              height={36}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{companion.name}</p>
              <div className="subject-badge max-sm:hidden">{displaySubject}</div>
            </div>
            <p className="text-lg">Figuring out server vs client components in Next.js and React.</p>
          </div>
        </div>

        <div className="items-start text-2xl max-md:hidden">{companion.duration} minutes</div>
      </article>

      <CompanionComponent
        companionId={companion.id}
        subject={companion.subject}
        topic={companion.topic}
        name={companion.name}
        userName={user?.firstName ?? ""}
        userImage={user?.imageUrl ?? ""}
        voice={companion.voice}
        style={companion.style}
      />
    </section>
  );
};

export default CompanionsPage;