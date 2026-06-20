"use client";

import Empty from "@acme/ui/empty";
import { Loader2 } from "lucide-react";

import { useMyFolders } from "~/hooks/use-folders";
import FolderCard from "../folder/folder-card";

const UserFolders = ({ userId }: { userId: string }) => {
  const { data: folders, isLoading, error } = useMyFolders();

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return folders && folders.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  ) : (
    <Empty message="No folders yet." />
  );
};

export default UserFolders;
