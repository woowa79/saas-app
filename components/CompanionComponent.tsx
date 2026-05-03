"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { CompanionComponentProps, SavedMessage } from "@/types";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { addToSessionHistory } from "@/lib/actions/companion.actions";
import vapi from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

type TranscriptMessagePayload = {
  type?: string;
  role?: SavedMessage["role"];
  transcriptType?: string;
  transcript?: string;
};

type Message = TranscriptMessagePayload;
type ChatMessage = SavedMessage & { id: string };

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return "";
};

const isExpectedMeetingEnd = (error: unknown) => {
  const message = getErrorMessage(error).toLowerCase();

  return message.includes("meeting has ended") || message.includes("ended due to ejection");
};

const isIgnorableVapiError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  return Object.keys(error).length === 0;
};

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const speakingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = 0;
    }
  }, [messages]);

  const normalizedSubject = subject.trim().toLowerCase() === "math" ? "maths" : subject.trim().toLowerCase();
  const displaySubject = normalizedSubject === "unknown" ? "coding" : normalizedSubject;
  const avatarSrc = userImage?.trim() ? userImage : "/images/logo.svg";
  const displayUserName = userName?.trim() ? userName : "Student";

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsMuted(false);
      setIsSpeaking(false);

      if (speakingTimeoutRef.current) {
        window.clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: unknown) => {
      if (isExpectedMeetingEnd(error)) {
        setCallStatus(CallStatus.FINISHED);
        setIsMuted(false);
        return;
      }

      const message = getErrorMessage(error).trim();

      if (isIgnorableVapiError(error) || !message) {
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      console.error("Vapi call error", message, error);
      setCallStatus(CallStatus.INACTIVE);
    };
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const role = message.role;
        const content = message.transcript?.trim();

        if (!role || !content) {
          return;
        }

        const newMessage = {
          id: typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role,
          content,
        } as ChatMessage;
        setMessages((prev) => [newMessage, ...prev]);

        // Fallback for SDKs where speech-start/end events are not emitted reliably.
        if (role === "assistant") {
          setIsSpeaking(true);
          if (speakingTimeoutRef.current) {
            window.clearTimeout(speakingTimeoutRef.current);
          }
          speakingTimeoutRef.current = window.setTimeout(() => {
            setIsSpeaking(false);
            speakingTimeoutRef.current = null;
          }, 1200);
        }
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      if (speakingTimeoutRef.current) {
        window.clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }

      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    }
  }, []);

  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isExpectedMeetingEnd(event.reason)) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);
  
  const toggleMicrophone = () => {
    if (callStatus !== CallStatus.ACTIVE) {
      return;
    }

    try {
      const muted = vapi.isMuted();
      vapi.setMuted(!muted);
      setIsMuted(!muted);
    } catch {
      setIsMuted(false);
    }
  };

  const isMicAvailable = callStatus === CallStatus.ACTIVE;

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      await vapi.start(configureAssistant(voice, style, topic, displaySubject));
      setCallStatus(CallStatus.ACTIVE);
      // addToSessionHistory(companionId)
      void addToSessionHistory(companionId).catch(() => {});
    } catch (error) {
      if (isExpectedMeetingEnd(error)) {
        setCallStatus(CallStatus.FINISHED);
        setIsMuted(false);
        return;
      }

      const message = getErrorMessage(error).trim();
      if (!message || isIgnorableVapiError(error)) {
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      console.error("Failed to start Vapi call", message, error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    setIsSpeaking(false);
    if (speakingTimeoutRef.current) {
      window.clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    try {
      const stopResult = vapi.stop();
      void Promise.resolve(stopResult).catch((error) => {
        if (!isExpectedMeetingEnd(error)) {
          console.error("Failed to stop Vapi call", error);
        }
      });
    } catch (error) {
      if (!isExpectedMeetingEnd(error)) {
        console.error("Failed to stop Vapi call", error);
      }
    }
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className={cn("companion-avatar", isSpeaking && "companion-avatar-speaking")}
            style={{ backgroundColor: getSubjectColor(displaySubject) }}
          >
            <Image
              src={`/icons/${displaySubject}.svg`}
              alt={displaySubject}
              width={150}
              height={150}
              className="max-sm:w-fit"
            />
            <div className={cn("voice-bars", isSpeaking && "voice-bars-speaking")} aria-hidden="true">
              <span className={cn("voice-bar", isSpeaking && "voice-bar-active")} />
              <span className={cn("voice-bar", isSpeaking && "voice-bar-active")} />
              <span className={cn("voice-bar", isSpeaking && "voice-bar-active")} />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={avatarSrc}
              alt={displayUserName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{displayUserName}</p>
          </div>

          <button
            className={cn("btn-mic", !isMicAvailable && "cursor-not-allowed opacity-50")}
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {!isMicAvailable ? "Start session first" : isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>

          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar" ref={transcriptRef}>
          {messages.length === 0 && (
            <p className="text-center text-slate-400 text-sm">
              {callStatus === CallStatus.ACTIVE
                ? "대화가 시작되었습니다..."
                : "세션을 시작하면 대화 내용이 여기에 표시됩니다."}
            </p>
          )}
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace(/[.,]/g, "")}: {message.content}
                </p>
              );
            }

            return (
              <p
                key={index}
                className="text-primary max-sm:text-sm"
              >
                {userName}: {message.content}
              </p>
            );
          })}
        </div>
        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
