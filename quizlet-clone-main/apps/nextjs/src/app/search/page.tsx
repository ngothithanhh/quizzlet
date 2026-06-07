"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BookOpen, Search as SearchIcon } from "lucide-react";
import { useAllStudySets } from "~/hooks/use-study-sets";
import PublicStudySetCard from "~/components/shared/public-study-set-card";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data: studySets, isLoading, error } = useAllStudySets(query);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 h-4 w-2/3 rounded bg-muted" />
            <div className="mb-2 h-3 w-1/2 rounded bg-muted" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-10 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Đã có lỗi xảy ra: {error}
      </div>
    );
  }

  if (!studySets || studySets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <SearchIcon size={56} className="mb-4 text-muted" />
        <h2 className="mb-2 text-xl font-bold">Không tìm thấy kết quả</h2>
        <p className="text-muted-foreground">
          Không có học phần nào phù hợp với "{query}". Vui lòng thử từ khoá khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {studySets.map((studySet) => (
        <PublicStudySetCard key={studySet.id} studySet={studySet} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-5xl py-8 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Kết quả tìm kiếm</h1>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
