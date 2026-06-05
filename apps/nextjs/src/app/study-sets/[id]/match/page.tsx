"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Puzzle } from "lucide-react";
import MatchMode from "~/components/match-mode/match-mode";

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  return (
    <div className="min-h-screen bg-background">
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
            <Puzzle size={15} className="text-pink-400" />
            Ghép thẻ
          </div>
          <div className="ml-auto rounded-full bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-400">
            Nối thuật ngữ – định nghĩa
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {isNaN(numericId) ? (
          <p className="text-center text-muted-foreground">ID không hợp lệ</p>
        ) : (
          <MatchMode studySetId={numericId} />
        )}
      </div>
    </div>
  );
}
