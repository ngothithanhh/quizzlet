"use client";

import { useCallback, useEffect, useState } from "react";
import { folderApi, type FolderRequest, type FolderResponse, type FolderSimpleResponse } from "~/lib/api-client";

export function useMyFolders() {
  const [data, setData] = useState<FolderSimpleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await folderApi.getMyFolders();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  return { data, isLoading, error, refetch: fetchFolders };
}

export function useFolderDetail(folderId: number | null) {
  const [data, setData] = useState<FolderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolder = useCallback(async () => {
    if (folderId === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await folderApi.getById(folderId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    void fetchFolder();
  }, [fetchFolder]);

  return { data, isLoading, error, refetch: fetchFolder };
}

export function useCreateFolder() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      data: FolderRequest,
      options?: { onSuccess?: (res: FolderResponse) => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      try {
        const result = await folderApi.create(data);
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
    []
  );

  return { mutate, isPending };
}

export function useUpdateFolder() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { id, data }: { id: number; data: FolderRequest },
      options?: { onSuccess?: (res: FolderResponse) => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      try {
        const result = await folderApi.update(id, data);
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
    []
  );

  return { mutate, isPending };
}

export function useDeleteFolder() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      id: number,
      options?: { onSuccess?: () => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      try {
        await folderApi.delete(id);
        options?.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return { mutate, isPending };
}

export function useAddStudySetToFolder() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { folderId, studySetId }: { folderId: number; studySetId: number },
      options?: { onSuccess?: (res: FolderResponse) => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      try {
        const result = await folderApi.addStudySet(folderId, studySetId);
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
    []
  );

  return { mutate, isPending };
}

export function useRemoveStudySetFromFolder() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      { folderId, studySetId }: { folderId: number; studySetId: number },
      options?: { onSuccess?: (res: FolderResponse) => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      try {
        const result = await folderApi.removeStudySet(folderId, studySetId);
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
    []
  );

  return { mutate, isPending };
}
