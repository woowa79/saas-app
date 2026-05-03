import Link from "next/link";
import Image from "next/image"; // Image를 쓰려면 이 줄이 필수입니다!

const CTA = () => {
  return (
    <section className="cta-section bg-slate-800 px-7 py-7 rounded-4xl border-2 border-black">
      {/* 1. 배지 부분 */}
      <div className="cta-badge inline-block px-4 py-1 bg-yellow-400 text-slate-900 rounded-full text-sm font-bold mb-4">
        Start learning your way.
      </div>

      {/* 2. 제목 및 설명 */}
      <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
        Build and Personalize <br /> Learning Companions
      </h2>
      
      <p className="text-slate-300 max-w-lg mb-5 leading-relaxed">
        Pick a name, subject, voice, & personality - and start learning through 
        voice conversations that feel natural and fun.
      </p>

     {/* 3. CTA 이미지 부분 수정 */}
<div className="mb-5">
  <Image 
    src="/images/cta.svg" 
    alt="cta" 
    width={362} 
    height={232} 
    className="mx-auto"// 👈 이 부분을 추가해 보세요!
  />
</div>
      {/* 4. 버튼 부분 (Link를 버튼 안에 넣는 올바른 방식) */}
      <button className="btn-primary bg-black text-white px-8 py-3 rounded-full flex items-center gap-3 mx-auto hover:bg-slate-800 transition-all shadow-xl">
        <Image 
          src="/icons/plus.svg" 
          alt="plus" 
          width={12} 
          height={12} 
        />
        <Link href="/companions/new" className="font-bold">
          Build a New Companion
        </Link>
      </button>
    </section>
  );
};

export default CTA;