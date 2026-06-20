/**
 * React hooks for Classroom CRUD via Spring Boot REST API.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

import type { 
  ClassroomRequest, 
  ClassroomResponse, 
  AddMemberRequest, 
  ClassMemberResponse, 
  StudySetResponse, 
  AssignmentRequest, 
  AssignmentResponse 
} from "~/lib/api-client";
import { classroomApi, assignmentApi } from "~/lib/api-client";

// ── useMyClassrooms ────────────────────────────────────────────────────────────

export function useMyClassrooms() {
  const [data, setData] = useState<ClassroomResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await classroomApi.getMyClassrooms();
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

// ── useCreateClassroom ─────────────────────────────────────────────────────────

export function useCreateClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: ClassroomRequest,
      options?: {
        onSuccess?: (result: Record<string, any>) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.create(data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useClassroom ──────────────────────────────────────────────────────────────

export function useClassroom(id: number | null) {
  const [data, setData] = useState<ClassroomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await classroomApi.getDetail(id);
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

// ── useUpdateClassroom ────────────────────────────────────────────────────────

export function useUpdateClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      data: ClassroomRequest,
      options?: {
        onSuccess?: (result: ClassroomResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.update(id, data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useDeleteClassroom ────────────────────────────────────────────────────────

export function useDeleteClassroom() {
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
        await classroomApi.delete(id);
        options?.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useJoinClassroom ──────────────────────────────────────────────────────────

export function useJoinClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      classCode: string,
      options?: {
        onSuccess?: (result: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.join(classCode);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useAddStudySetToClassroom ────────────────────────────────────────────────

export function useAddStudySetToClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, studySetId }: { classId: number; studySetId: number },
      options?: {
        onSuccess?: (result: ClassroomResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.addStudySet(classId, studySetId);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useLeaveClassroom ─────────────────────────────────────────────────────────

export function useLeaveClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      classId: number,
      options?: {
        onSuccess?: (result: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.leaveClassroom(classId);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useClassMembers ───────────────────────────────────────────────────────────

export function useClassMembers(classId: number | null, refreshTrigger?: number) {
  const [data, setData] = useState<ClassMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (classId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await classroomApi.getClassMembers(classId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    void fetch();
  }, [fetch, refreshTrigger]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useAddMember ──────────────────────────────────────────────────────────────

export function useAddMember() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, data }: { classId: number; data: AddMemberRequest },
      options?: {
        onSuccess?: (result: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.addMember(classId, data);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useRemoveMember ───────────────────────────────────────────────────────────

export function useRemoveMember() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, targetUserId }: { classId: number; targetUserId: number },
      options?: {
        onSuccess?: (result: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.removeMember(classId, targetUserId);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useUpdateMemberRole ───────────────────────────────────────────────────────

export function useUpdateMemberRole() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, targetUserId, role }: { classId: number; targetUserId: number; role: string },
      options?: {
        onSuccess?: (result: ClassMemberResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.updateMemberRole(classId, targetUserId, role);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useClassStudySets ─────────────────────────────────────────────────────────

export function useClassStudySets(classId: number | null, refreshTrigger?: number) {
  const [data, setData] = useState<StudySetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (classId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await classroomApi.getStudySetsByClassroom(classId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    void fetch();
  }, [fetch, refreshTrigger]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useRemoveStudySet ─────────────────────────────────────────────────────────

export function useRemoveStudySet() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, studySetId }: { classId: number; studySetId: number },
      options?: {
        onSuccess?: (result: string) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.removeStudySet(classId, studySetId);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}

// ── useClassAssignments ───────────────────────────────────────────────────────

export function useClassAssignments(classId: number | null, refreshTrigger?: number) {
  const [data, setData] = useState<AssignmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (classId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignmentApi.getClassAssignments(classId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    void fetch();
  }, [fetch, refreshTrigger]);

  return { data, isLoading, error, refetch: fetch };
}

// ── useCreateAssignment ───────────────────────────────────────────────────────

export function useCreateAssignment() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, data }: { classId: number; data: AssignmentRequest },
      options?: {
        onSuccess?: (result: AssignmentResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await assignmentApi.create(classId, data);
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

// ── useAddFavoriteStudySetToClassroom ────────────────────────────────────────

export function useAddFavoriteStudySetToClassroom() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { classId, studySetId }: { classId: number; studySetId: number },
      options?: {
        onSuccess?: (result: ClassroomResponse) => void;
        onError?: (error: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const result = await classroomApi.addFavoriteStudySet(classId, studySetId);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        if (!options?.onError) {
          console.error("Mutation error:", error);
        }
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending };
}
