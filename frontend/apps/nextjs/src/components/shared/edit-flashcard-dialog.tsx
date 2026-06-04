"use client";

import type { MouseEvent } from "react";
import type { z } from "zod";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Edit, Loader2Icon } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
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
import { toast } from "@acme/ui/toast";
import { EditFlashcardSchema } from "@acme/validators";

import { api } from "~/trpc/react";

interface EditFlashcardDialogProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][number];
}

const EditFlashcardDialog = ({ flashcard }: EditFlashcardDialogProps) => {
  const { id }: { id: string } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm({
    schema: EditFlashcardSchema,
    defaultValues: flashcard,
  });
  const utils = api.useUtils();
  const { mutate, isPending } = api.flashcard.edit.useMutation({
    onSuccess() {
      toast.success("Đã lưu thẻ học");
      setOpen(false);
      void utils.studySet.byId.invalidate({ id });
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  useEffect(() => {
    form.reset(flashcard);
  }, [flashcard]);

  const handleStopPropagation = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => {
    event.stopPropagation();
  };

  function onSubmit(values: z.infer<typeof EditFlashcardSchema>) {
    mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleStopPropagation}
          className="rounded-full"
          variant="ghost"
          size="icon"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thẻ học</DialogTitle>
          <DialogDescription>
            Cập nhật nội dung thuật ngữ và định nghĩa của thẻ.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thuật ngữ</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Nhập thuật ngữ" {...field} />
                  </FormControl>
                  <FormDescription>Mặt trước của thẻ học.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định nghĩa</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Nhập định nghĩa" {...field} />
                  </FormControl>
                  <FormDescription>Mặt sau của thẻ học.</FormDescription>
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
                ) : (
                  "Lưu"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlashcardDialog;
