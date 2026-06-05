/**
 * React hooks for StudySet CRUD via Spring Boot REST API.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  StudySetRequest,
  StudySetResponse,
  StudySetSimpleResponse,
} from "~/lib/api-client";
import { studySetApi } from "~/lib/api-client";

// ── useMyStudySets ────────────────────────────────────────────────────────────

export function useMyStudySets() {
  const [data, setData] = useState<StudySetSimpleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await studySetApi.getMyStudySets();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useAllStudySets ───────────────────────────────────────────────────────────

export function useAllStudySets(keyword?: string) {
  const [data, setData] = useState<StudySetSimpleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await studySetApi.getAll(keyword);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useStudySet ───────────────────────────────────────────────────────────────

export function useStudySet(id: number | null) {
  const [data, setData] = useState<StudySetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await studySetApi.getById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useCreateStudySet ─────────────────────────────────────────────────────────

export function useCreateStudySet() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: StudySetRequest,
      options?: {
        onSuccess?: (result: StudySetResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await studySetApi.create(data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useUpdateStudySet ─────────────────────────────────────────────────────────

export function useUpdateStudySet() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      data: StudySetRequest,
      options?: {
        onSuccess?: (result: StudySetResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await studySetApi.update(id, data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useDeleteStudySet ─────────────────────────────────────────────────────────

export function useDeleteStudySet() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        await studySetApi.delete(id);
        options?.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useSetVisibility ──────────────────────────────────────────────────────────

export function useSetVisibility() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      isPublic: boolean,
      options?: {
        onSuccess?: (result: StudySetResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await studySetApi.setVisibility(id, isPublic);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}
