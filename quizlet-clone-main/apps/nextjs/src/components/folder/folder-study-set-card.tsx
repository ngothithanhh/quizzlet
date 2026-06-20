"use client";

import { useParams } from "next/navigation";

import { useAddStudySetToFolder, useRemoveStudySetFromFolder, useFolderDetail } from "~/hooks/use-folders";
import ToggleCard from "../shared/toggle-card";

export default function FolderStudySetCard({
  studySet,
  isIn,
  folderId,
}: {
  studySet: { id: number; title: string };
  isIn: boolean;
  folderId: number;
}) {
  const { mutate: addSet } = useAddStudySetToFolder();
  const { mutate: removeSet } = useRemoveStudySetFromFolder();
  const { refetch } = useFolderDetail(folderId);

  async function onSettled() {
    await refetch();
  }

  function onClick() {
    const params = {
      folderId,
      studySetId: studySet.id,
    };

    if (isIn) {
      removeSet(params, { onSuccess: onSettled });
    } else {
      addSet(params, { onSuccess: onSettled });
    }
  }

  return <ToggleCard isIn={isIn} onClick={onClick} name={studySet.title} />;
}
