import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = async () => {
  // Clerk에서 세션 정보를 가져옵니다.
  const { getToken } = await auth();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      global: {
        fetch: async (url, options = {}) => {
          const clToken = await getToken({ template: "supabase" }); // supabase용 토큰 생성
          
          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${clToken}`);

          return fetch(url, { ...options, headers });
        },
      },
    }
  );
};