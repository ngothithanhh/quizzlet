"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

import type { CreateFolderValues, EditFolderValues } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";
import { CreateFolderSchema, EditFolderSchema } from "@acme/validators";

import { useCreateFolder, useUpdateFolder } from "~/hooks/use-folders";

interface FolderDialogProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: EditFolderValues;
}

const FolderDialog = ({
  children,
  open,
  onOpenChange,
  defaultValues,
}: FolderDialogProps) => {
  const { mutate: createFolder, isPending: isCreating } = useCreateFolder();
  const { mutate: updateFolder, isPending: isUpdating } = useUpdateFolder();

  const form = useForm({
    schema: defaultValues ? EditFolderSchema : CreateFolderSchema,
    defaultValues: defaultValues ?? {
      name: "",
    },
  });

  function onSubmit(values: EditFolderValues | CreateFolderValues) {
    if ("id" in values) {
      updateFolder(
        { id: Number(values.id), data: values },
        {
          onSuccess() {
            toast.success("Đã lưu thư mục");
            if (onOpenChange) {
              onOpenChange(false);
            }
            // You might want to trigger a refetch here via queryClient or let the parent do it
          },
          onError() {
            toast.error("Không thể lưu thư mục. Vui lòng thử lại");
          },
        }
      );
    } else {
      createFolder(values, {
        onSuccess(data) {
          toast.success(
            <span>
              Đã tạo thư mục mới, xem{" "}
              <Link
                href={`/users/${data.userId}/folders/${data.id}`}
                className="underline"
              >
                tại đây
              </Link>
            </span>
          );
          form.reset();
          if (onOpenChange) {
            onOpenChange(false);
          }
        },
        onError() {
          toast.error("Không thể tạo thư mục, vui lòng thử lại");
        },
      });
    }
  }

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Sửa" : "Tạo"} thư mục</DialogTitle>
          <DialogDescription>
            Quản lý học phần của bạn bên trong thư mục.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thư mục</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Ví dụ: Tiếng Anh"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tên hiển thị công khai của thư mục.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : defaultValues ? (
                  "Lưu"
                ) : (
                  "Tạo"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
