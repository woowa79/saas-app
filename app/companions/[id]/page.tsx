import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCompanion } from "@/lib/actions/companion.actions";
import CompanionComponent from "@/components/CompanionComponent";
import { recentSessions, subjectsColors } from "@/constants";

const getSubjectColor = (subject: string) => {
  const key = subject.trim().toLowerCase() as keyof typeof subjectsColors;
  return subjectsColors[key] ?? "#F3F4F6";
};

interface CompanionSessionPageProps {
  params: { id: string };
}

const CompanionSessionPage = async ({ params }: CompanionSessionPageProps) => {
  const { id } = params;
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  // DB에서 먼저 찾고, 없으면 recentSessions 상수에서 찾음
  let companion = await getCompanion(id);
  if (!companion) {
    companion = recentSessions.find((c) => c.id === id) ?? null;
  }

  if (!companion) {
    redirect("/companions");
  }

  const displaySubject =
    companion.subject.trim().toLowerCase() === "unknown"
      ? "coding"
      : companion.subject.trim().toLowerCase() === "math"
        ? "maths"
        : companion.subject;
  const iconSubject = displaySubject;

  return (
    <section className="flex flex-col gap-8">
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg"
            style={{ backgroundColor: getSubjectColor(displaySubject) }}
          >
            <Image
              src={`/icons/${iconSubject.toLowerCase()}.svg`}
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
            <p className="text-lg">{companion.topic}</p>
          </div>
        </div>

        <div className="items-start text-2xl max-md:hidden">
          {companion.duration} minutes
        </div>
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

export default CompanionSessionPage;
