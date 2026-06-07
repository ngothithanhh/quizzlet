"use client";

import Link from "next/link";
import { BookOpen, Eye, EyeOff, Star } from "lucide-react";
import type { StudySetSimpleResponse } from "~/lib/api-client";
import { FavoriteButton } from "./favorite-button";

const StudySetCard = ({
  studySet,
}: {
  studySet: StudySetSimpleResponse;
}) => {
  const { id, title, totalFlashcards, username } = studySet;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <Link
        href={`/study-sets/${id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={title}
      />

      <div className="relative z-10">
        <FavoriteButton studySetId={id} />
        {/* Header with Title */}
        <div className="flex items-start justify-between">
          <h3 className="mb-1 line-clamp-2 font-semibold text-foreground pr-6">
            {title}
          </h3>
        </div>

        {/* Description */}
        {studySet.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {studySet.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {totalFlashcards} thẻ
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} />
            {studySet.favoriteCount}
          </span>
          <span className="flex items-center gap-1">
            {studySet.isPublic ? (
              <>
                <Eye size={12} /> Công khai
              </>
            ) : (
              <>
                <EyeOff size={12} /> Riêng tư
              </>
            )}
          </span>
        </div>
      </div>

      {/* Username */}
      <div className="relative z-10 mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">@{username}</span>
      </div>
    </div>
  );
};

export default StudySetCard;
