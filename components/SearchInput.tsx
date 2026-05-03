"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
// 1. 필요한 함수들을 모두 불러옵니다.
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/utils";

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 초기 검색어를 가져옵니다.
  const query = searchParams.get("topic") || "";
  const [searchQuery, setSearchQuery] = useState(query); // 초기값 설정

  useEffect(() => {
    // 2. setTimeout의 시간을 500으로 수정했습니다.
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "topic",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === "/companions") {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["topic"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500); // delay: 500 대신 그냥 500

    return () => clearTimeout(delayDebounceFn); // 메모리 누수 방지를 위해 추가
  }, [searchQuery, router, searchParams, pathname]);

  return (
    <div className="relative border border-black rounded-lg flex items-center gap-2 px-2 py-1 h-fit">
      <Image src="/icons/search.svg" alt="search" width={15} height={15} />
      <input
        type="text"
        placeholder="Search topics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none bg-transparent flex-1"
      />
    </div>
  );
};

export { SearchInput };