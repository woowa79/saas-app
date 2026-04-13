import CompanionCard from "@/components/ui/CompanionCard";

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
      
    </main>
  );
};

export default Page;