"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon, Trash2, Trash2Icon } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { useDeleteFolder } from "~/hooks/use-folders";

const DeleteFolderDialog = ({ id, userId }: { id: string | number; userId: string | number }) => {
  const { mutate, isPending } = useDeleteFolder();
  const router = useRouter();

  const deleteFolder = () => {
    mutate(Number(id), {
      onSuccess() {
        toast.success("Đã xóa thư mục thành công");
        router.push(`/users/${userId}/folders`);
      },
      onError() {
        toast.error("Không thể xóa thư mục, vui lòng thử lại");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. Thư mục sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            disabled={isPending}
            onClick={deleteFolder}
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

export default DeleteFolderDialog;
