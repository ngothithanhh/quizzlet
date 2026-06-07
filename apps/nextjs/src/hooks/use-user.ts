import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { userApi, type UserProfileUpdateRequest } from "~/lib/api-client";

export function useMyProfile() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: userApi.getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdateRequest) => userApi.updateMyProfile(data),
    onSuccess: () => {
      // Invalidate the cache so the new profile is fetched
      void queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}
