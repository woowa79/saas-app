import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  House,
  Search,
  Wrench,
} from "lucide-react";

const focusCards = [
  {
    title: "임대주택 알아보기",
    description: "매입임대·국민임대 등 주거 유형을 쉬운 말로 살펴봅니다.",
    href: "#housing-types",
    icon: House,
  },
  {
    title: "신청 조건 확인하기",
    description: "공고를 볼 때 어떤 항목부터 확인해야 하는지 안내합니다.",
    href: "#before-apply",
    icon: Search,
  },
  {
    title: "서류 준비하기",
    description: "신청 전에 챙길 내용을 차근차근 체크합니다.",
    href: "#checklist",
    icon: ClipboardCheck,
  },
  {
    title: "집수리 정보",
    description: "앞으로 집수리 지원과 주거 관리 정보도 연결합니다.",
    href: "#coming-next",
    icon: Wrench,
  },
];

export default function NuriTalkPage() {
  return (
    <div className="w-full space-y-12 pb-16 text-[#26332F]">
      <section className="rounded-[2rem] bg-[#F7F5EF] px-6 py-12 sm:px-10 sm:py-16">
        <p className="mb-4 text-lg font-bold tracking-wide text-[#245B4A]">
          NURITOK · 누리톡
        </p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
          내 삶에 필요한 정보,
          <br />
          누리톡에서 잇다.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#43534D] sm:text-xl">
          주거 정보가 어렵고 신청 준비가 막막할 때,
          내게 필요한 내용을 쉬운 말로 하나씩 확인해 보세요.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#housing-types"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#245B4A] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#194536]"
          >
            임대주택 정보 보기 <ArrowRight size={21} aria-hidden="true" />
          </Link>
          <Link
            href="#checklist"
            className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-[#245B4A] px-6 py-3 text-lg font-bold text-[#245B4A] transition hover:bg-white"
          >
            신청 준비 체크하기
          </Link>
        </div>
      </section>

      <section aria-labelledby="start-title">
        <div className="mb-6">
          <p className="text-base font-bold text-[#A06B19]">START HERE</p>
          <h2 id="start-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
            어떤 정보가 필요하신가요?
          </h2>
          <p className="mt-3 text-lg leading-8 text-[#53615B]">
            필요한 항목을 선택하면 해당 안내로 이동합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {focusCards.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-36 items-start gap-5 rounded-2xl border border-[#D9E1DC] bg-white p-6 transition hover:border-[#245B4A] hover:shadow-md"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF1EC] text-[#245B4A]">
                <Icon size={28} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold">{title}</span>
                <span className="mt-2 block text-base leading-7 text-[#53615B]">
                  {description}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-base font-bold text-[#245B4A]">
                  살펴보기 <ArrowRight size={18} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="housing-types" className="scroll-mt-8 rounded-2xl border border-[#D9E1DC] p-6 sm:p-8">
        <p className="text-base font-bold text-[#A06B19]">주거이음</p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          임대주택, 어디서부터 알아볼까요?
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#53615B]">
          매입임대주택을 비롯해 다양한 임대주택의 특징과 신청 흐름을
          하나씩 정리해 드릴 예정입니다. 주택 유형과 모집 공고에 따라
          자격과 제출 서류가 다르므로, 실제 신청 전에는 반드시 해당 공고문을
          확인해야 합니다.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["매입임대주택", "국민임대주택", "영구임대주택"].map((name) => (
            <div key={name} className="rounded-xl bg-[#F7F5EF] p-5 text-lg font-bold">
              {name}
              <p className="mt-2 text-sm font-normal leading-6 text-[#53615B]">
                유형별 안내를 준비하고 있습니다.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="before-apply" className="scroll-mt-8 rounded-2xl bg-[#EAF1EC] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <BookOpen className="text-[#245B4A]" size={28} aria-hidden="true" />
          <p className="text-base font-bold text-[#245B4A]">신청 전 꼭 확인하세요</p>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          공고문은 내 상황에 맞춰 읽어야 합니다.
        </h2>
        <p className="mt-4 text-lg leading-8 text-[#43534D]">
          나이, 세대 구성, 소득, 자산, 거주 지역 등 공고에서 요구하는 조건을
          빠짐없이 확인하는 습관이 중요합니다. 누리톡은 복잡한 표현을 쉽게
          풀어드리고, 확인해야 할 항목을 정리하는 것을 목표로 합니다.
        </p>
      </section>

      <section id="checklist" className="scroll-mt-8 rounded-2xl border border-[#D9E1DC] p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">신청 준비 체크리스트</h2>
        <p className="mt-3 text-lg leading-8 text-[#53615B]">
          첫 번째 체크리스트를 준비하고 있습니다. 실제 공고에 맞춰 확인할 수
          있도록 항목과 공식 출처를 함께 안내하겠습니다.
        </p>
        <ul className="mt-5 list-inside list-disc space-y-3 text-lg leading-8">
          <li>관심 있는 주택 유형과 모집 공고 확인</li>
          <li>신청 자격과 세대 기준 확인</li>
          <li>소득·자산 등 공고별 기준 확인</li>
          <li>제출 서류와 신청 기간 확인</li>
        </ul>
      </section>

      <section id="coming-next" className="scroll-mt-8 rounded-2xl bg-[#F7F5EF] p-6 sm:p-8">
        <p className="text-base font-bold text-[#A06B19]">앞으로 연결할 정보</p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          집을 구하는 일부터, 살아가는 일까지.
        </h2>
        <p className="mt-4 text-lg leading-8 text-[#53615B]">
          주거 정보를 먼저 탄탄하게 만든 뒤 집수리와 주거 관리, 생활 복지,
          일자리와 배움 정보로 천천히 넓혀가겠습니다.
        </p>
      </section>
    </div>
  );
}
