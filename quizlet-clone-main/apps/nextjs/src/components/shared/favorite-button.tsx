"use client";

import { Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";
import { toast } from "@acme/ui/toast";
import { cn } from "@acme/ui";

interface FavoriteButtonProps {
  studySetId: number;
}

export function FavoriteButton({ studySetId }: FavoriteButtonProps) {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: () => favoriteApi.getMyFavorites(),
    enabled: isLoggedIn,
  });

  const isFavorited = favorites.some((f) => f.id === studySetId);

  const toggleFavorite = useMutation({
    mutationFn: async (currentlyFavorited: boolean) => {
      if (currentlyFavorited) {
        await favoriteApi.remove(studySetId);
        return false;
      } else {
        await favoriteApi.add(studySetId);
        return true;
      }
    },
    onMutate: async (currentlyFavorited) => {
      await queryClient.cancelQueries({ queryKey: ["my-favorites"] });
      const previousFavorites = queryClient.getQueryData(["my-favorites"]);
      
      queryClient.setQueryData(["my-favorites"], (old: any[] = []) => {
        if (currentlyFavorited) {
          return old.filter((f: any) => f.id !== studySetId);
        } else {
          return [...old, { id: studySetId }];
        }
      });
      return { previousFavorites };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["my-favorites"], context.previousFavorites);
      }
      toast.error("Không thể cập nhật danh sách yêu thích");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thao tác");
      return;
    }

    toggleFavorite.mutate(isFavorited);
  };

  return (
    <button
      onClick={handleFavoriteClick}
      className="absolute right-1 top-1 z-20 rounded-full p-2 transition hover:bg-muted"
      aria-label={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
      title={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
    >
      <Star
        size={18}
        className={cn(
          "transition-colors",
          isFavorited
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground hover:text-amber-400"
        )}
      />
    </button>
  );
}
