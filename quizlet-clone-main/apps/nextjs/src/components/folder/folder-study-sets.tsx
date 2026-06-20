"use client";

import React from "react";
import { useParams } from "next/navigation";

import Empty from "@acme/ui/empty";

import { useFolderDetail } from "~/hooks/use-folders";
import StudySetCard from "../shared/study-set-card";

const FolderStudySets = () => {
  const { slug }: { slug: string } = useParams();
  const folderId = Number(slug);
  const { data: folder, isLoading } = useFolderDetail(folderId);

  if (isLoading || !folder) return null;

  if (folder.studySets.length === 0) {
    return <Empty message="Folder is empty" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folder.studySets.map((studySet) => (
        <StudySetCard 
          key={studySet.id} 
          studySet={{
            id: Number(studySet.id),
            title: studySet.title,
            username: studySet.username || "User",
            totalFlashcards: studySet.totalFlashcards || 0,
            description: studySet.description || "",
            isPublic: true,
            favoriteCount: 0
          }} 
        />
      ))}
    </div>
  );
};

export default FolderStudySets;
