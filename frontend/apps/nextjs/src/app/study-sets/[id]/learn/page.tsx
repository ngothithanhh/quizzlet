"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

import LearnMode from "~/components/learn-mode/learn-mode";

export default function LearnPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={`/study-sets/${id}`}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Quay lại
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GraduationCap size={15} className="text-violet-400" />
            Học thông minh
          </div>
          <div className="ml-auto rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
            Spaced Repetition
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {isNaN(numericId) ? (
          <p className="text-center text-muted-foreground">ID không hợp lệ</p>
        ) : (
          <LearnMode studySetId={numericId} />
        )}
      </div>
    </div>
  );
}
