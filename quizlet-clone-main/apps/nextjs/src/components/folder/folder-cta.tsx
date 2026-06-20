"use client";

import { Edit } from "lucide-react";

import { Button } from "@acme/ui/button";

import { useAuth } from "~/contexts/auth-context";
import { useFolderDetail } from "~/hooks/use-folders";
import DeleteFolderDialog from "./delete-folder-dialog";
import FolderDialog from "./folder-dialog";
import FolderStudySetsDialog from "./folder-study-sets-dialog";

interface FolderCTAProps {
  slug: string;
}

const FolderCTA = ({ slug }: FolderCTAProps) => {
  const folderId = Number(slug);
  const { data: folder, isLoading } = useFolderDetail(folderId);
  const { user } = useAuth();

  if (isLoading || !folder || folder.userId !== Number(user?.id)) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <FolderStudySetsDialog userId={folder.userId.toString()} />
      <FolderDialog
        defaultValues={{
          id: folder.id.toString(),
          name: folder.name,
        }}
      >
        <Button size="icon" variant="outline">
          <Edit size={16} />
        </Button>
      </FolderDialog>
      <DeleteFolderDialog id={folder.id} userId={folder.userId} />
    </div>
  );
};

export default FolderCTA;
