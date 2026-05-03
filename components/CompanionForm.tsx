"use client"

import * as z from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // redirect 대신 useRouter를 사용합니다 (클라이언트 컴포넌트용)

import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "./ui/form"; 
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { subjects, voices } from "@/constants";
import { createCompanion } from "@/lib/actions/companion.actions";
import type { CreateCompanion } from "@/types";

// 1. 설계도
const formSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다."),
  subject: z.string().min(1, "과목을 선택해주세요."),
  topic: z.string().min(1, "주제를 입력해주세요."),
  voice: z.string().min(1),
  style: z.string().min(1),
  duration: z.coerce.number().min(1),
});

type CompanionFormValues = z.infer<typeof formSchema>;

const CompanionForm = () => {
  const router = useRouter(); // 페이지 이동을 위한 도구

  const buildCompanionQuery = (values: CompanionFormValues) => {
    const params = new URLSearchParams({
      name: values.name,
      subject: values.subject,
      topic: values.topic,
      duration: String(values.duration),
      voice: values.voice,
      style: values.style,
    });
    return `/companions?${params.toString()}`;
  };

  const form = useForm<CompanionFormValues>({
    resolver: zodResolver(formSchema) as Resolver<CompanionFormValues>,
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "male",
      style: "formal",
      duration: 15,
    },
  });

const onSubmit = async (values: CompanionFormValues) => {
  try {
    // 폼 값을 앱 표준 Companion 생성 페이로드로 전달합니다.
    const formattedData: CreateCompanion = {
      name: values.name,
      subject: values.subject,
      topic: values.topic,
      duration: values.duration,
      voice: values.voice,
      style: values.style,
    };

    // 2. 서버 응답이 지연될 경우를 대비해 타임아웃을 둡니다.
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 7000);
    });

    const companion = (await Promise.race([
      createCompanion(formattedData),
      timeoutPromise,
    ])) as Awaited<ReturnType<typeof createCompanion>> | null;

    if (companion) {
      if (companion.id.startsWith("local-")) {
        router.push(buildCompanionQuery(values));
      } else {
        router.push(`/companions/${companion.id}`);
      }
      return;
    }

    // 타임아웃 또는 null 응답이면 입력값 기반으로 바로 이동시켜 UX 정체를 방지합니다.
    router.push(buildCompanionQuery(values));
  } catch (error) {
    console.error("데이터 저장 실패:", error);
    router.push(buildCompanionQuery(values));
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Companion Name</FormLabel>
              <FormControl><Input placeholder="AI 친구의 이름을 정해주세요" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="카테고리 선택" /></SelectTrigger></FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Topic & Instructions</FormLabel>
              <FormControl><Textarea placeholder="예: 20년 경력의 공매 전문가처럼 조언해줘." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Voice Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.keys(voices).map((voiceKey) => (
                      <SelectItem key={voiceKey} value={voiceKey}>
                        {voiceKey.charAt(0).toUpperCase() + voiceKey.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Conversation Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {/* voices.male이 없을 경우를 대비해 안전하게 처리 */}
                    {Object.keys(voices.male || {}).map((styleKey) => (
                      <SelectItem key={styleKey} value={styleKey}>
                        {styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Duration (mins)</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting} // 제출 중 버튼 비활성화
          className="w-full bg-blue-600 py-6 rounded-2xl font-bold text-white hover:bg-blue-700"
        >
          {form.formState.isSubmitting ? "Creating..." : "Create Companion"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanionForm;