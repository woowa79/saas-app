import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const getSubjectColor = (subject: string) => {
  const s = subject.toLowerCase();
  if (s === "science") return "#E5D0FF";
  if (s === "maths") return "#FFD0D0";
  if (s === "coding") return "#D0E5FF";
  if (s === "history") return "#D0FFE5";
  if (s === "language") return "#FFF4D0";
  if (s === "economics") return "#FFE5D0";
  return "#F3F4F6";
};

const CompanionsList = ({ title, companions, className }: any) => {
  return (
    <article className={cn("w-full text-left", className)}>
      <h2 className="font-bold text-3xl mb-10 text-left">{title}</h2>

      {/* 테이블 헤더 부분 */}
      <div className="flex w-full border-b-2 border-slate-100 pb-4 mb-4 px-0">
        <div className="w-[60%] text-lg font-bold text-left text-slate-900">Lessons</div>
        <div className="w-[20%] text-lg font-bold text-center text-slate-900">Subject</div>
        <div className="w-[20%] text-lg font-bold text-right text-slate-900">Duration</div>
      </div>

      {/* 리스트 부분 */}
      <div className="flex flex-col gap-2">
        {companions?.map(({ id, subject, name, topic, duration }: any) => (
          <div key={id} className="group border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all">
            <div className="flex w-full items-center py-6 px-0">
              
              {/* 1. 아이콘 + 이름 상자 (무조건 왼쪽 정렬) */}
              <div className="w-[60%] flex items-center justify-start gap-6 text-left">
                {/* 데스크탑 아이콘 */}
                <div 
                  className="hidden md:flex size-[70px] items-center justify-center rounded-2xl flex-shrink-0" 
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <Image
                    src={`/icons/${subject.toLowerCase()}.svg`}
                    alt={subject}
                    width={32}
                    height={32}
                  />
                </div>
                
                <div className="flex flex-col gap-1 text-left">
                  <Link href={`/companions/${id}`}>
                    <p className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {name}
                    </p>
                  </Link>
                  <p className="text-sm font-medium text-slate-500">{topic}</p>
                  
                  {/* 모바일 아이콘 */}
                  <div className="md:hidden flex size-9 items-center justify-center rounded-xl mt-1" 
                       style={{ backgroundColor: getSubjectColor(subject) }}>
                    <Image src={`/icons/${subject.toLowerCase()}.svg`} alt={subject} width={18} height={18} />
                  </div>
                </div>
              </div>

              {/* 2. 과목 뱃지 (가운데) */}
              <div className="w-[20%] flex justify-center">
                <span className="px-4 py-1.5 rounded-lg bg-black text-white text-[12px] font-bold uppercase tracking-widest shadow-md">
                  {subject}
                </span>
              </div>

              {/* 3. 시간 (오른쪽) */}
              <div className="w-[20%] flex items-center justify-end gap-2">
                <span className="text-3xl font-black text-slate-900">{duration}</span>
                <span className="text-sm font-bold text-slate-400">mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default CompanionsList;