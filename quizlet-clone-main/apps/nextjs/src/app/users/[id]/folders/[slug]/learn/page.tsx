"use client";

import { useFolderDetail } from "~/hooks/use-folders";
import LearnMode from "~/components/learn-mode/learn-mode";
import { Loader2 } from "lucide-react";

export default function FolderLearnPage({
  params: { id, slug },
}: {
  params: { id: string; slug: string };
}) {
  const folderId = Number(slug);
  const { data: folder, isLoading } = useFolderDetail(folderId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!folder) {
    return <div className="p-8 text-center">Thư mục không tồn tại</div>;
  }

  const studySetsId = folder.studySets.map((s) => s.id);

  if (studySetsId.length === 0) {
    return <div className="p-8 text-center">Thư mục chưa có học phần nào để học.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <LearnMode
        folderId={folderId}
        studySetsId={studySetsId}
        backUrl={`/users/${id}/folders/${slug}`}
      />
    </div>
  );
}
