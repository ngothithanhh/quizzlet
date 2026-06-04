import { useQuery } from "@tanstack/react-query";

import { historyApi } from "~/lib/api-client";

export function useTestHistory() {
  return useQuery({
    queryKey: ["history", "tests"],
    queryFn: historyApi.getTests,
  });
}

export function useLearnHistory() {
  return useQuery({
    queryKey: ["history", "learns"],
    queryFn: historyApi.getLearns,
  });
}

export function useMatchHistory() {
  return useQuery({
    queryKey: ["history", "matches"],
    queryFn: historyApi.getMatches,
  });
}
