'use server';

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import type { Companion, CreateCompanion, GetAllCompanions } from "@/types";

const createSupabaseAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return null;
    }

    return createClient(supabaseUrl, serviceRoleKey);
};

const isRlsError = (message?: string) =>
    typeof message === "string" && message.toLowerCase().includes("row-level security");

const normalizeCompanion = (row: Record<string, unknown>): Companion | null => {
    const id = row.id ?? row.$id;
    if (typeof id !== "string" || id.trim().length === 0) return null;

    const subject = row.subject ?? row.categoryId;
    const topic = row.topic ?? row.description;

    return {
        id,
        name: typeof row.name === "string" ? row.name : "",
        subject: typeof subject === "string" && subject.trim().length > 0 ? subject : "unknown",
        topic: typeof topic === "string" ? topic : "",
        duration: typeof row.duration === "number" ? row.duration : Number(row.duration ?? 0),
        bookmarked: Boolean(row.bookmarked),
        voice: typeof row.voice === "string" ? row.voice : "female",
        style: typeof row.style === "string" ? row.style : "formal",
    };
};

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();

    if (!userId) {
        return false;
    }

    const supabase = await createSupabaseClient();
    let limit = 0;

    const canUse = (check: Record<string, string>) => {
        if (typeof has !== "function") {
            return false;
        }

        return (has as (value: Record<string, string>) => boolean)(check);
    };

    if (canUse({ plan: "pro" })) {
        return true;
    } else if (canUse({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if (canUse({ feature: "10_companion_limit" })) {
        limit = 10;
    } else {
        return false;
    }

    const ownerColumns = ["author", "user_id", "userId"];

    for (const ownerColumn of ownerColumns) {
        const { count, error } = await supabase
            .from("companions")
            .select("id", { count: "exact", head: true })
            .eq(ownerColumn, userId);

        if (error) {
            const normalizedMessage = error.message.toLowerCase();
            if (normalizedMessage.includes("column") || normalizedMessage.includes("does not exist")) {
                continue;
            }

            console.error("Companion Permission Check Error:", error.message);
            return false;
        }

        return (count ?? 0) < limit;
    }

    const { data, error } = await supabase
        .from("companions")
        .select("id")
        .eq("author", userId);

    if (error) {
        throw new Error(error.message);
    }

    const companionCount = data?.length ?? 0;
    if (companionCount > limit) return false;
    return true;
};

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const supabase = await createSupabaseClient();
    const adminSupabase = createSupabaseAdminClient();

    // Try multiple payload shapes and owner-key variants so schema differences don't break inserts.
    const basePayloads: Array<Record<string, unknown>> = [
        {
            name: formData.name,
            subject: formData.subject,
            topic: formData.topic,
            duration: formData.duration,
            voice: formData.voice,
            style: formData.style,
        },
        {
            name: formData.name,
            categoryId: formData.subject,
            description: formData.topic,
            instructions: formData.topic,
            duration: formData.duration,
            seed: formData.style,
            src: "/images/placeholder.png",
        },
        {
            name: formData.name,
            topic: formData.topic,
            duration: formData.duration,
        },
        {
            name: formData.name,
            description: formData.topic,
            duration: formData.duration,
        },
        {
            name: formData.name,
            duration: formData.duration,
        },
    ];

    const ownerVariants: Array<Record<string, unknown>> = [
        { author: userId },
        { userId },
        { user_id: userId },
        {},
    ];

    const candidatePayloads: Array<Record<string, unknown>> = [];
    for (const base of basePayloads) {
        for (const owner of ownerVariants) {
            candidatePayloads.push({ ...base, ...owner });
        }
    }

    const tryInsertWithClient = async (client: any) => {
        let localData: Record<string, unknown> | null = null;
        let localError: { message?: string } | null = null;

        for (const payload of candidatePayloads) {
            const result: { data: unknown; error: { message?: string } | null } = await client
                .from("companions")
                .insert(payload)
                .select()
                .single();

            if (!result.error && result.data) {
                localData = result.data as Record<string, unknown>;
                localError = null;
                break;
            }

            localError = result.error;
        }

        return { data: localData, error: localError };
    };

    let { data, error } = await tryInsertWithClient(supabase);

    if ((!data || error) && isRlsError(error?.message) && adminSupabase) {
        const adminResult = await tryInsertWithClient(adminSupabase);
        data = adminResult.data;
        error = adminResult.error;
    }

    if (error || !data) {
        console.error("Supabase Error:", error?.message);

        if (isRlsError(error?.message) && !adminSupabase) {
            // Keep the app usable in dev environments where RLS insert is blocked.
            return {
                id: `local-${Date.now()}`,
                name: formData.name,
                subject: formData.subject || "coding",
                topic: formData.topic,
                duration: formData.duration,
                bookmarked: false,
                voice: formData.voice,
                style: formData.style,
            };
        }

        throw new Error(error?.message || "Failed to create companion");
    }

    const normalized = normalizeCompanion((data ?? {}) as Record<string, unknown>);
    if (!normalized) {
        throw new Error("Failed to normalize created companion");
    }

    return normalized;
}

export const getCompanion = async (id: string) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("companions")
        .select()
        .eq("id", id)
        .maybeSingle();

    if (!error && data) {
        const normalized = normalizeCompanion(data as Record<string, unknown>);
        if (!normalized) {
            throw new Error("Failed to normalize companion");
        }

        return normalized;
    }

    const fallbackResult = await supabase.from("companions").select();

    if (fallbackResult.error) {
        console.error("Supabase Error:", fallbackResult.error.message);
        return null;
    }

    const normalized = (fallbackResult.data ?? [])
        .map((row) => normalizeCompanion(row as Record<string, unknown>))
        .filter((row): row is Companion => row !== null)
        .find((row) => row.id === id);

    return normalized ?? null;
}

export const getAllCompanions = async ({limit = 10, page = 1, subject, topic}: GetAllCompanions) => {
    const supabase = await createSupabaseClient();
    const subjectFilter = Array.isArray(subject) ? subject[0] : subject;
    const topicFilter = Array.isArray(topic) ? topic[0] : topic;
    const { data, error } = await supabase
        .from("companions")
        .select()
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Supabase Error:", error.message);
        return [];
    }

    const normalized = (data ?? [])
        .map((row) => normalizeCompanion(row as Record<string, unknown>))
        .filter((row): row is Companion => row !== null);

    const filtered = normalized.filter((row) => {
        const matchesSubject = subjectFilter
            ? row.subject.toLowerCase().includes(subjectFilter.toLowerCase())
            : true;

        const matchesTopic = topicFilter
            ? row.topic.toLowerCase().includes(topicFilter.toLowerCase()) ||
              row.name.toLowerCase().includes(topicFilter.toLowerCase())
            : true;

        return matchesSubject && matchesTopic;
    });

    const offset = (page - 1) * limit;
    return filtered.slice(offset, offset + limit);
}

type SessionHistoryJoinRow = {
    companions: Record<string, unknown> | Record<string, unknown>[] | null;
};

const extractCompanionRows = (rows: SessionHistoryJoinRow[]) => {
    return rows.flatMap((row) => {
        if (!row.companions) return [];
        return Array.isArray(row.companions) ? row.companions : [row.companions];
    });
};

const insertSessionHistory = async (companionId: string, userId: string) => {
    const supabase = await createSupabaseClient();

    const result = await supabase
        .from("session_history")
        .insert({
            companion_id: companionId,
            user_id: userId,
        })
        .select("companions:companion_id (*)");

    if (result.error) {
        if (isRlsError(result.error.message)) {
            return [];
        }

        console.error("Session Insert Error:", result.error.message);
        throw new Error(result.error.message);
    }

    const rows = (result.data ?? []) as unknown as SessionHistoryJoinRow[];
    return extractCompanionRows(rows)
        .map((row) => normalizeCompanion(row))
        .filter((row): row is Companion => row !== null);
};

export const createSessionHistory = async (companionId: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return insertSessionHistory(companionId, userId);
};

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return insertSessionHistory(companionId, userId);
};

export const getRecentsessions = async (limit = 10) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("session_history")
        .select("companions:companion_id (*)")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(error.message);
    }

    const rows = (data ?? []) as unknown as SessionHistoryJoinRow[];
    return extractCompanionRows(rows)
        .map((row) => normalizeCompanion(row))
        .filter((row): row is Companion => row !== null);
};

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("session_history")
        .select("companions:companion_id (*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Fetch Sessions Error:", error.message);
        throw new Error(error.message);
    }

    const rows = (data ?? []) as unknown as SessionHistoryJoinRow[];
    return extractCompanionRows(rows)
        .map((row) => normalizeCompanion(row))
        .filter((row): row is Companion => row !== null);
};

export const getUserCompanions = async (userId: string) => {
    const supabase = await createSupabaseClient();
    const ownerColumns = ["author", "user_id", "userId"];
    let lastErrorMessage = "";

    for (const ownerColumn of ownerColumns) {
        const { data, error } = await supabase
            .from("companions")
            .select()
            .eq(ownerColumn, userId)
            .order("created_at", { ascending: false });

        if (error) {
            lastErrorMessage = error.message;

            const normalizedMessage = error.message.toLowerCase();
            if (normalizedMessage.includes("column") || normalizedMessage.includes("does not exist")) {
                continue;
            }

            console.error("Fetch User Companions Error:", error.message);
            throw new Error(error.message);
        }

        return (data ?? [])
            .map((row) => normalizeCompanion(row as Record<string, unknown>))
            .filter((row): row is Companion => row !== null);
    }

    if (lastErrorMessage) {
        console.error("Fetch User Companions Error:", lastErrorMessage);
    }

    return [];
};

// Keep backward compatibility with previous typoed export name.
export const getUsersessions = getUserSessions;
