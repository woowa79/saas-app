import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string"; // 만약 여기서 에러가 나면 npm install query-string을 해야 합니다.
import { subjectsColors, voices } from "@/constants";

const normalizeSubjectKey = (subject: string) => {
  const value = subject.trim().toLowerCase();
  if (value === "math") return "maths";
  return value;
};

/**
 * 1. 디자인용 함수 (기존에 있던 것)
 * 클래스명을 조건부로 합치고 Tailwind 중복을 해결해줍니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  const key = normalizeSubjectKey(subject) as keyof typeof subjectsColors;
  return subjectsColors[key] ?? "#F3F4F6";
};

/**
 * 2. URL 쿼리 생성 함수 (추가)
 * 주소창에 검색어나 필터 값을 안전하게 넣어줍니다.
 */
export const formUrlQuery = ({ params, key, value }: { params: string; key: string; value: string }) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

/**
 * 3. URL 쿼리 삭제 함수 (추가)
 * 주소창에서 특정 검색어나 필터를 제거할 때 사용합니다.
 */
export const removeKeysFromUrlQuery = ({ params, keysToRemove }: { params: string; keysToRemove: string[] }) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export { subjectsColors, voices };

export const getSubjectColorFromMap = (subject: string) => {
  const key = normalizeSubjectKey(subject) as keyof typeof subjectsColors;
  return subjectsColors[key] ?? "#F3F4F6";
};

type CreateAssistantDTO = {
  name: string;
  firstMessage: string;
  transcriber: {
    provider: "deepgram";
    model: "nova-3";
    language: "en";
  };
  voice: {
    provider: "11labs";
    voiceId: string;
    stability: number;
    similarityBoost: number;
    speed: number;
    style: number;
    useSpeakerBoost: boolean;
  };
  model: {
    provider: "openai";
    model: "gpt-4o-mini";
    messages: Array<{
      role: "system";
      content: string;
    }>;
  };
};

export const configureAssistant = (
  voice: string,
  style: string,
  topic = "the selected topic",
  subject = "coding"
): CreateAssistantDTO => {
  const voiceKey = voice?.toLowerCase() === "male" ? "male" : "female";
  const styleKey = style?.toLowerCase() === "casual" ? "casual" : "formal";
  const voiceId = voices[voiceKey][styleKey] ?? "sarah";
  const normalizedSubject = normalizeSubjectKey(subject);

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage: `Hello, let's start the session. Today we'll be talking about ${topic}.`,
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice conversation.

Tutor Guidelines:
- Stick to the given topic: ${topic}
- Stick to the given subject: ${normalizedSubject}
- Keep the conversation flowing smoothly while maintaining context.
- From time to time make sure that the student is following you.
- Break the topic into smaller parts and teach the student step by step.
- Keep your style of conversation ${style.toLowerCase()}.
- Keep your responses short, like in a real voice conversation.
- Do not include any special characters in your responses.`,
        },
      ],
    },
  };

  return vapiAssistant;
};