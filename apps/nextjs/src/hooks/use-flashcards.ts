/**
 * React hooks for Flashcard CRUD via Spring Boot REST API.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  FlashcardRequest,
  FlashcardResponse,
} from "~/lib/api-client";
import { flashcardApi } from "~/lib/api-client";

// ── useFlashcardsByStudySet ───────────────────────────────────────────────────

export function useFlashcardsByStudySet(studySetId: number | null) {
  const [data, setData] = useState<FlashcardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (studySetId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await flashcardApi.getByStudySet(studySetId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [studySetId]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useCreateFlashcard ────────────────────────────────────────────────────────

export function useCreateFlashcard() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: FlashcardRequest,
      options?: {
        onSuccess?: (result: FlashcardResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await flashcardApi.create(data);
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

// ── useUpdateFlashcard ────────────────────────────────────────────────────────

export function useUpdateFlashcard() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      data: FlashcardRequest,
      options?: {
        onSuccess?: (result: FlashcardResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await flashcardApi.update(id, data);
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

// ── useDeleteFlashcard ────────────────────────────────────────────────────────

export function useDeleteFlashcard() {
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
        await flashcardApi.delete(id);
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

// ── useCloneFlashcards ────────────────────────────────────────────────────────

export function useCloneFlashcards() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      sourceStudySetId: number,
      targetStudySetId: number,
      options?: {
        onSuccess?: (result: { message: string }) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await flashcardApi.clone({
          sourceStudySetId,
          targetStudySetId,
        });
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

// ── useImportFlashcards ───────────────────────────────────────────────────────

export function useImportFlashcards() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      studySetId: number,
      file: File,
      options?: {
        onSuccess?: (result: { message: string }) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await flashcardApi.import(studySetId, file);
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
