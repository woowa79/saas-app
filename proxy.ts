import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // 1. 다음 파일들은 검사하지 않고 통과시킵니다 (이미지, 스타일시트 등)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    // 2. API 경로나 trpc 경로는 항상 이 검사기를 거치도록 설정합니다
    '/(api|trpc)(.*)',
  ],
};