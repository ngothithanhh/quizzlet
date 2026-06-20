"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
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

import { useMyStudySets } from "~/hooks/use-study-sets";
import { flashcardApi, studySetApi } from "~/lib/api-client";
import type { FlashcardResponse } from "~/lib/api-client";
import { Input } from "@acme/ui/input";

// ── Sub-components ────────────────────────────────────────────────────────────

const StudySetCloneCard = ({
  title,
  selected,
  onClick,
}: {
  title: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <Card onClick={onClick} className={`cursor-pointer transition-colors ${selected ? "border-primary" : ""}`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border">
          {selected ? <CheckIcon size={16} className="text-primary" /> : null}
        </div>
      </div>
    </CardContent>
  </Card>
);

const FlashcardCheckItem = ({
  card,
  checked,
  onToggle,
}: {
  card: FlashcardResponse;
  checked: boolean;
  onToggle: () => void;
}) => (
  <div
    onClick={onToggle}
    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
      checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
    }`}
  >
    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
      checked ? "border-primary bg-primary text-primary-foreground" : "border-border"
    }`}>
      {checked && <CheckIcon size={12} />}
    </div>
    <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
      <p className="text-sm font-medium truncate">{card.term}</p>
      <p className="text-sm text-muted-foreground truncate">{card.definition}</p>
    </div>
  </div>
);

// ── Main Dialog ───────────────────────────────────────────────────────────────

interface StudySetCloneDialogProps {
  sourceId: number;
  sourceTitle?: string;
  flashcards: FlashcardResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select-cards" | "select-target";

const StudySetCloneDialog = ({
  open,
  onOpenChange,
  sourceId,
  sourceTitle,
  flashcards,
}: StudySetCloneDialogProps) => {
  const { data: studySets, isLoading: isSetsLoading } = useMyStudySets();
  const router = useRouter();

  const [step, setStep] = useState<Step>("select-cards");
  const [selectedCardIds, setSelectedCardIds] = useState<Set<number>>(new Set());
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [isPending, setIsPending] = useState(false);

  const toggleCard = (id: number) => {
    setSelectedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedCardIds.size === flashcards.length) {
      setSelectedCardIds(new Set());
    } else {
      setSelectedCardIds(new Set(flashcards.map((c) => c.id)));
    }
  };

  const handleClone = async () => {
    if (!selectedTargetId || selectedCardIds.size === 0) return;
    if (selectedTargetId === -1 && !newSetTitle.trim()) {
      toast.error("Vui lòng nhập tên học phần mới");
      return;
    }
    
    setIsPending(true);
    try {
      let targetId = selectedTargetId;
      
      // Nếu chọn tạo mới, tạo study set trước
      if (selectedTargetId === -1) {
        const newSet = await studySetApi.create({
          title: newSetTitle.trim(),
          description: "Sao chép từ " + (sourceTitle ?? "học phần khác"),
          isPublic: false,
          flashcards: []
        });
        targetId = newSet.id;
      }

      await flashcardApi.clone({
        targetStudySetId: targetId,
        sourceFlashcardIds: Array.from(selectedCardIds),
      });
      toast.success(`Đã sao chép ${selectedCardIds.size} thẻ thành công`);
      onOpenChange(false);
      router.push(`/study-sets/${targetId}`);
    } catch {
      toast.error("Không thể sao chép flashcard");
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      // Reset state when closing
      setStep("select-cards");
      setSelectedCardIds(new Set());
      setSelectedTargetId(null);
      setNewSetTitle("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "select-cards" ? "Chọn thẻ muốn sao chép" : "Chọn học phần đích"}
          </DialogTitle>
          <DialogDescription>
            {step === "select-cards"
              ? `Chọn từng thẻ từ "${sourceTitle ?? "học phần này"}" để sao chép.`
              : `Chọn học phần của bạn để dán ${selectedCardIds.size} thẻ vào.`}
          </DialogDescription>
        </DialogHeader>

        {step === "select-cards" ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                Đã chọn {selectedCardIds.size}/{flashcards.length} thẻ
              </span>
              <button
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:underline"
              >
                {selectedCardIds.size === flashcards.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>
            <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
              {flashcards.map((card) => (
                <FlashcardCheckItem
                  key={card.id}
                  card={card}
                  checked={selectedCardIds.has(card.id)}
                  onToggle={() => toggleCard(card.id)}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
              <Button
                onClick={() => setStep("select-target")}
                disabled={selectedCardIds.size === 0}
                className="gap-2"
              >
                Tiếp tục ({selectedCardIds.size} thẻ)
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex max-h-80 flex-col gap-4 overflow-y-auto p-1">
              {isSetsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2Icon className="animate-spin text-primary" size={24} />
                </div>
              ) : studySets ? (
                <>
                  <StudySetCloneCard
                    key="new"
                    onClick={() => setSelectedTargetId(-1)}
                    selected={selectedTargetId === -1}
                    title="+ Tạo học phần mới"
                  />
                  {selectedTargetId === -1 && (
                    <div className="px-1">
                      <Input
                        placeholder="Nhập tên học phần mới..."
                        value={newSetTitle}
                        onChange={(e) => setNewSetTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                  {studySets
                    .filter((set) => set.id !== sourceId)
                    .map((set) => (
                      <StudySetCloneCard
                        key={set.id}
                        onClick={() => setSelectedTargetId(set.id)}
                        selected={selectedTargetId === set.id}
                        title={set.title}
                      />
                    ))}
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground p-4">
                  Bạn chưa có học phần nào để sao chép vào.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select-cards")}>
                Quay lại
              </Button>
              <Button onClick={() => void handleClone()} disabled={isPending || !selectedTargetId} className="gap-2">
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <CopyIcon size={16} />
                )}
                Sao chép
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudySetCloneDialog;
