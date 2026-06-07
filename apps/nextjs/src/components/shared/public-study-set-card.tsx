import Link from "next/link";
import { BookOpen, Star, User } from "lucide-react";
import type { StudySetSimpleResponse } from "~/lib/api-client";

interface PublicStudySetCardProps {
  studySet: StudySetSimpleResponse;
}

export default function PublicStudySetCard({ studySet }: PublicStudySetCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Main link overlay */}
      <Link
        href={`/study-sets/${studySet.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={studySet.title}
      />

      <div className="relative z-10">
        {/* Title */}
        <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">
          {studySet.title}
        </h3>

        {/* Description */}
        {studySet.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {studySet.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1 font-medium bg-muted px-2 py-1 rounded-md">
            <BookOpen size={12} />
            {studySet.totalFlashcards} thẻ
          </span>
          <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md font-medium">
            <Star size={12} className="fill-current" />
            {studySet.favoriteCount}
          </span>
        </div>
      </div>

      {/* Author */}
      <div className="relative z-10 mt-5 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={12} />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {studySet.username}
        </span>
      </div>
    </div>
  );
}
