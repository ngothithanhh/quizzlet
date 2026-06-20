"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Folder } from "lucide-react";

import { useFolderDetail } from "~/hooks/use-folders";

const FolderInfo = () => {
  const { slug }: { slug: string } = useParams();
  const folderId = Number(slug);
  const { data: folder, isLoading } = useFolderDetail(folderId);

  if (isLoading || !folder) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Folder size={38} />
        <span className="mb-0 text-4xl font-bold">{folder.name}</span>
      </div>
    </div>
  );
};

export default FolderInfo;
