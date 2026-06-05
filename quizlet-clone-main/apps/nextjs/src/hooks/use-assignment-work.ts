import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { assignmentWorkApi, assignmentApi } from "~/lib/api-client";
import type {
  AssignmentSubmissionResponse,
  AssignmentStartResponse,
  AssignmentSubmitRequest,
  AssignmentResponse,
} from "~/lib/api-client";

// ── Queries ──────────────────────────────────────────────────────────────────

export function useMyAssignmentResult(assignmentId: number | null) {
  const [data, setData] = useState<AssignmentSubmissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (assignmentId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignmentWorkApi.getMyResult(assignmentId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useAssignmentDetail(assignmentId: number | null) {
  const [data, setData] = useState<AssignmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (assignmentId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignmentApi.getDetail(assignmentId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useStartAssignment() {
  return useMutation({
    mutationFn: (assignmentId: number) => assignmentWorkApi.start(assignmentId),
  });
}

export function useSubmitAssignment() {
  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: number;
      data: AssignmentSubmitRequest;
    }) => assignmentWorkApi.submit(assignmentId, data),
  });
}
