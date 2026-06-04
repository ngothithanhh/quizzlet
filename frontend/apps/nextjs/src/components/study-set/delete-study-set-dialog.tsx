"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

interface DeleteStudySetDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteStudySetDialog = ({
  id,
  open,
  onOpenChange,
}: DeleteStudySetDialogProps) => {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate, isPending } = api.studySet.delete.useMutation({
    onSuccess() {
      void utils.studySet.invalidate();
      toast.success("Đã xóa học phần thành công");
      router.push("/latest");
    },
    onError() {
      toast.error("Không thể xóa học phần, vui lòng thử lại");
    },
  });

  const deleteStudySet = () => {
    mutate({ id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Học phần sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            disabled={isPending}
            onClick={deleteStudySet}
            variant="destructive"
          >
            {isPending ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <>
                Xóa <Trash2Icon size={16} className="ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudySetDialog;
