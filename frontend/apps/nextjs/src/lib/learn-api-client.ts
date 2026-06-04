/**
 * Learn API types & client – Spring Boot /api/learn endpoints.
 */

import { getAccessToken } from "~/lib/auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/quizzlet";

// ── Types ──────────────────────────────────────────────────────────────────────

export type LearnResult = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type StudyStatus = "NEW" | "LEARNING" | "REVIEW" | "MASTERED";

export interface LearnCardResponse {
  flashcardId: number;
  term: string;
  definition: string;
  mediaList: {
    id: number;
    url: string;
    type: "IMAGE" | "AUDIO";
    side: "TERM" | "DEFINITION";
  }[];
  priorityScore: number;
  memoryLevel: number;
  studyStatus: StudyStatus;
}

export interface LearnCardRequest {
  flashcardId: number;
  result: LearnResult;
}

// ── Core fetch ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// ── Learn API ──────────────────────────────────────────────────────────────────

export const learnApi = {
  /** Get cards sorted by priority score (excludes MASTERED cards) */
  getCards: (studySetId: number) =>
    apiFetch<LearnCardResponse[]>(`/api/learn/${studySetId}`),

  /** Submit a learn result for spaced-repetition tracking */
  submit: (data: LearnCardRequest) =>
    apiFetch<void>("/api/learn/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Reset learning progress for a specific study set */
  reset: (studySetId: number) =>
    apiFetch<void>(`/api/learn/${studySetId}/reset`, {
      method: "POST",
    }),
};
