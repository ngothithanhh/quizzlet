import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { testApi } from "~/lib/api-client";
import type { CreateTestRequest, TestSubmitRequest, TestCardResponse } from "~/lib/api-client";

export function useTestById(id: number | null) {
  const [data, setData] = useState<TestCardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (id === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await testApi.getById(id);
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

export function useGenerateTest() {
  return useMutation({
    mutationFn: (data: CreateTestRequest) => testApi.generate(data),
  });
}

export function useSubmitTest() {
  return useMutation({
    mutationFn: (data: TestSubmitRequest) => testApi.submit(data),
  });
}
