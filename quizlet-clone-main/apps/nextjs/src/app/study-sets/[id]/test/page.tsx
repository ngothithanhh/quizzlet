"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import TestMode from "~/components/test-mode/test-mode";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            href={`/study-sets/${id}`}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Quay lại
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText size={15} className="text-amber-400" />
            Kiểm tra
          </div>
          <div className="ml-auto rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            Trắc nghiệm · Tự luận · Đúng/Sai
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        {isNaN(numericId) ? (
          <p className="text-center text-muted-foreground">ID không hợp lệ</p>
        ) : (
          <TestMode studySetId={numericId} />
        )}
      </div>
    </div>
  );
}
