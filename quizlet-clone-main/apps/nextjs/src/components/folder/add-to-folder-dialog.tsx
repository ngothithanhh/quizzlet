"use client";

import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { toast } from "@acme/ui/toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import { useMyFolders } from "~/hooks/use-folders";
import { folderApi } from "~/lib/api-client";

interface AddToFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studySetId: number;
}

const AddToFolderDialog = ({
  open,
  onOpenChange,
  studySetId,
}: AddToFolderDialogProps) => {
  const { data: folders, isLoading } = useMyFolders();
  const [addingToId, setAddingToId] = useState<number | null>(null);

  const handleAdd = async (folderId: number) => {
    try {
      setAddingToId(folderId);
      await folderApi.addStudySet(folderId, studySetId);
      toast.success("Đã thêm vào thư mục!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setAddingToId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm vào thư mục</DialogTitle>
          <DialogDescription>
            Chọn một thư mục để lưu học phần này.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : !folders || folders.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              Bạn chưa có thư mục nào. Hãy tạo thư mục trước.
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition cursor-pointer"
                onClick={() => handleAdd(folder.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FolderPlus size={18} />
                  </div>
                  <span className="font-medium text-sm">{folder.name}</span>
                </div>
                {addingToId === folder.id && (
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToFolderDialog;
