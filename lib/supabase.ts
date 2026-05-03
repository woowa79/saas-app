import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = async () => {
  // Clerk에서 세션 정보를 가져옵니다.
  const { getToken } = await auth();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        fetch: async (url, options = {}) => {
          const headers = new Headers(options.headers);

          // Token template이 없거나 비로그인 상태일 때는 익명 요청으로 폴백합니다.
          try {
            const clToken = await getToken({ template: "supabase" });
            if (clToken) {
              headers.set("Authorization", `Bearer ${clToken}`);
            }
          } catch {
            // Public read 경로는 anon key로도 동작하도록 에러를 삼킵니다.
          }

          return fetch(url, { ...options, headers });
        },
      },
    }
  );
};