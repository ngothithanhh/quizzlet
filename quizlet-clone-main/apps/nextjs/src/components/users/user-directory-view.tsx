"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, User, Loader2 } from "lucide-react";
import { toast } from "@acme/ui/toast";

import { userApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";

export default function UserDirectoryView() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", "search", debouncedQuery],
    queryFn: () => userApi.searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      toast.success("Đã xoá người dùng");
      void queryClient.invalidateQueries({ queryKey: ["users", "search"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể xoá người dùng");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xoá người dùng này?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Danh bạ người dùng</h1>
        <p className="text-muted-foreground mt-2">
          Tìm kiếm và quản lý người dùng trong hệ thống.
        </p>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm người dùng theo tên hoặc email..."
          className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && users && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <User size={48} className="opacity-20 mb-4" />
            <p>Không tìm thấy người dùng nào phù hợp.</p>
          </div>
        )}

        {!isLoading && users && users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deleteMutation.isPending || currentUser?.email === user.email}
                className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition disabled:opacity-50"
                title="Xoá người dùng"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {!debouncedQuery && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search size={48} className="opacity-20 mb-4" />
            <p>Nhập từ khoá để bắt đầu tìm kiếm người dùng.</p>
          </div>
        )}
      </div>
    </div>
  );
}
