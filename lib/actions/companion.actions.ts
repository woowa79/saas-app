'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

// 만약 CreateCompanion 타입이 정의되어 있지 않다면 아래처럼 타입을 지정해줘야 합니다.
// 보통은 별도의 파일에 있겠지만, 에러 방지를 위해 간단히 명시합니다.
interface CreateCompanion {
  name: string;
  description: string;
  instructions: string;
  seed: string;
  src: string;
  categoryId: string;
}

export const createCompanion = async (formData: CreateCompanion) => {
    // 1. Clerk에서 현재 로그인한 유저의 ID를 가져옵니다. (userId 오타 수정)
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 2. Supabase 클라이언트를 생성합니다.
    const supabase = await createSupabaseClient();

    // 3. 데이터를 삽입합니다. (불필요한 설명 텍스트와 세미콜론 제거)
    const { data, error } = await supabase
        .from("companions")
        .insert({
            ...formData,
            userId: userId, // DB 컬럼명에 맞춰 userId를 넣어줍니다.
        })
        .select()
        .single(); // 데이터 하나만 가져오도록 명시

    if (error) {
        console.error("Supabase Error:", error.message);
        throw new Error(error.message || "Failed to create companion");
    }
        
    return data;
}