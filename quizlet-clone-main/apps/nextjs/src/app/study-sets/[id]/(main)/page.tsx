"use client";

import { useParams } from "next/navigation";
import StudySetDetailSB from "~/components/study-set/study-set-detail-sb";

export default function StudySetPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return (
      <div className="mx-auto max-w-3xl py-10 text-center text-muted-foreground">
        ID học phần không hợp lệ.
      </div>
    );
  }

  return <StudySetDetailSB studySetId={numericId} />;
}
