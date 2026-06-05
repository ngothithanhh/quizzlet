"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import StudySetFormSB from "~/components/study-set/study-set-form-sb";
import { useStudySet, useMyStudySets } from "~/hooks/use-study-sets";
import { useAuth } from "~/contexts/auth-context";

export default function EditStudySetPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const { data: myStudySets, isLoading: isMySetsLoading } = useMyStudySets();
  const { data: studySet, isLoading, error } = useStudySet(
    isNaN(numericId) ? null : numericId,
  );

  if (isAuthLoading || isLoading || isMySetsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !studySet || isNaN(numericId)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {error ?? "Không tìm thấy học phần"}
        </p>
        <button
          onClick={() => router.push("/my-sets")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Quay lại học phần của tôi
        </button>
      </div>
    );
  }

  // Check ownership using myStudySets array from backend
  const isOwner = myStudySets?.some((set) => set.id === studySet.id);

  if (!user || !isOwner) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">Bạn không có quyền chỉnh sửa học phần này.</p>
        <button
          onClick={() => router.push(`/study-sets/${id}`)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return <StudySetFormSB defaultValues={studySet} />;
}
