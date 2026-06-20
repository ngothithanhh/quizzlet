"use client";

import { useMyFolders } from "~/hooks/use-folders";
import FolderCard from "~/components/folder/folder-card";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/contexts/auth-context";

export default function UserFoldersPage({ params }: { params: { id: string } }) {
  const { data: folders, isLoading } = useMyFolders();
  const { user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const isOwner = String(user?.id) === params.id;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        Thư mục {isOwner ? "của tôi" : ""}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {folders?.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
        {folders?.length === 0 && !isOwner && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            Người dùng này chưa có thư mục nào.
          </div>
        )}
      </div>
    </div>
  );
}
