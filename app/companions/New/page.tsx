import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CompanionForm from "@/components/CompanionForm";

const NewCompanionPage = async () => {
  // 1. 보안 체크: 로그인 안 된 유저는 로그인 페이지로 강제 이동
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen py-10 px-4 bg-slate-50/50">
      {/* 1. 상단 경로 표시 (Breadcrumb) */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 w-full max-w-2xl">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="font-bold text-black">New Companion</span>
      </nav>

      {/* 2. 중앙 컨테이너 */}
      <article className="w-full max-w-2xl bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-10">
        
        {/* 헤더 섹션 */}
        <div className="flex flex-col gap-3 border-b border-slate-50 pb-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Companion Builder
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            나만의 <span className="text-blue-600 font-semibold">주택 관리 매니저</span> 혹은 
            <span className="text-orange-500 font-semibold"> 학습 동반자</span>를 설계해 보세요.
          </p>
        </div>

        {/* 3. 폼 컴포넌트 호출 */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CompanionForm />
        </section>
        
      </article>
      
      <footer className="mt-10 text-slate-400 text-sm">
        © 2026 Landflow Exit-3000 Project
      </footer>
    </main>
  );
};

export default NewCompanionPage;