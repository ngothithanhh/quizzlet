"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Loader2Icon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@acme/ui/dialog";
import Empty from "@acme/ui/empty";
import { toast } from "@acme/ui/toast";

import { useFolderDetail } from "~/hooks/use-folders";
import { useMyStudySets } from "~/hooks/use-study-sets";
import { folderApi } from "~/lib/api-client";
import ToggleCard from "../shared/toggle-card";

interface FolderStudySetsDialogProps {
  userId: string;
}

const FolderStudySetsDialog = ({ userId }: FolderStudySetsDialogProps) => {
  const { slug }: { slug: string } = useParams();
  const folderId = Number(slug);
  const { data: studySets, isLoading: isSetsLoading } = useMyStudySets();
  const { data: folder, isLoading: isFolderLoading, refetch } = useFolderDetail(folderId);

  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isPending, setIsPending] = useState(false);

  // Initialize selected IDs when folder data loads or dialog opens
  useEffect(() => {
    if (folder?.studySets && open) {
      setSelectedIds(new Set(folder.studySets.map(s => s.id)));
    }
  }, [folder, open]);

  if (isSetsLoading || isFolderLoading || !folder || !studySets) return null;

  const allStudySets = [
    ...folder.studySets,
    ...studySets.filter(
      (set) => !folder.studySets.some((folderSet) => folderSet.id === set.id),
    ),
  ].sort((a, b) => a.title.localeCompare(b.title));

  const toggleSet = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      const originalIds = new Set(folder.studySets.map(s => s.id));
      const toAdd = Array.from(selectedIds).filter(id => !originalIds.has(id));
      const toRemove = Array.from(originalIds).filter(id => !selectedIds.has(id));

      const addPromises = toAdd.map(id => folderApi.addStudySet(folderId, id));
      const removePromises = toRemove.map(id => folderApi.removeStudySet(folderId, id));

      await Promise.all([...addPromises, ...removePromises]);
      
      toast.success("Đã lưu thay đổi");
      await refetch();
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error("Không thể lưu thay đổi");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm/Xoá học phần khỏi thư mục</DialogTitle>
          <DialogDescription>
            Quản lý các học phần trong thư mục này.
          </DialogDescription>
        </DialogHeader>
        <Link href="/create-set">
          <Button className="w-full" variant="secondary">Tạo học phần mới</Button>
        </Link>

        {allStudySets.length > 0 ? (
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-1">
            {allStudySets.map((set) => (
              <ToggleCard
                key={set.id}
                name={set.title}
                isIn={selectedIds.has(set.id)}
                onClick={() => toggleSet(set.id)}
              />
            ))}
          </div>
        ) : (
          <Empty message="Bạn chưa có học phần nào" className="my-4" />
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={() => void handleSave()} disabled={isPending} className="gap-2">
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderStudySetsDialog;
