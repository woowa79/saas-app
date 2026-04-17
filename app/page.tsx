import CompanionsList from "@/components/CompanionsList";
import CompanionCard from "@/components/ui/CompanionCard";
import { recentSessions } from "@/constants";
import CTA from "@/components/CTA"; // 이 줄을 추가하면 'Cannot find name' 에러가 사라집니다!

const Page = () => {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-8">Popular Companions</h1>

      <section className="home-section flex gap-6 md:flex-nowrap">
        <CompanionCard
          id="123"
          name="Neura the Brainy Explorer"
          topic="Neural Network of the Brain"
          subject="science"
          duration={45}
          color="#ffda6e"
        />

        <CompanionCard
          id="456"
          name="Countsy the Number Wizard"
          topic="Derivatives & Integrals"
          subject="science"
          duration={30}
          color="#e5d0ff"
        />

        <CompanionCard
          id="789"
          name="Verba the Vocabulary Builder"
          topic="language"
          subject="English Literature"
          duration={30}
          color="#BDE7FF"
        />
      </section>

    <section className="home-section">
      {/* 1. title 뒤에 있던 '>'를 지우고 속성들을 깔끔하게 정렬했습니다. */}
      <CompanionsList
        title="Recent completed Sessions"
        companions={recentSessions}
        className="w-2/3 max-lg:w-full"
      />
      <CTA />
    </section>
  </main>
  );
};

export default Page; 