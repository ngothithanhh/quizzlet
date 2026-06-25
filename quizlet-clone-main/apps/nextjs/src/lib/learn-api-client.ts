/**
 * Learn API types & client – Spring Boot /api/learn endpoints.
 */

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "~/lib/auth";
import { env } from "~/env";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

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

export interface LearnStudySetsRequest {
  studySetsId: number[];
}

// ── Core fetch ─────────────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const getHeaders = (token: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  let token = getAccessToken();
  let res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers: getHeaders(token) });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized - No refresh token");
    }

    if (isRefreshing) {
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers: getHeaders(newToken) });
      } catch (err) {
        throw err;
      }
    } else {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh?token=${encodeURIComponent(refreshToken)}`, {
          method: "POST",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshRes.json() as { accessToken: string; refreshToken: string };
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers: getHeaders(newAccessToken) });
      } catch (err) {
        processQueue(err as Error, null);
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  }

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

  /** Get cards for multiple study sets in a folder */
  getCardsByFolderStudySets: (folderId: number, data: LearnStudySetsRequest) =>
    apiFetch<LearnCardResponse[]>(`/api/learn/folder/${folderId}/studysets`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Get hard cards for review */
  getHardCards: (studySetId: number) =>
    apiFetch<LearnCardResponse[]>(`/api/learn/${studySetId}/hard-cards`),
};
