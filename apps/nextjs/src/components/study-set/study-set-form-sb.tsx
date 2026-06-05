"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  Loader2,
  PlusIcon,
  ToggleLeft,
  ToggleRight,
  Trash2Icon,
  Download,
  Upload,
} from "lucide-react";

import type {
  FlashcardRequest,
  StudySetResponse,
} from "~/lib/api-client";
import { flashcardApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";
import { useCreateStudySet, useUpdateStudySet } from "~/hooks/use-study-sets";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FlashcardField {
  localId: string;
  id?: number;
  term: string;
  definition: string;
  position: number;
}

interface StudySetFormSBProps {
  defaultValues?: StudySetResponse;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let _counter = 0;
const genId = () => `fc-${++_counter}-${Date.now()}`;

const makeEmpty = (position: number): FlashcardField => ({
  localId: genId(),
  term: "",
  definition: "",
  position,
});

const INITIAL_COUNT = 4;

// ── Component ─────────────────────────────────────────────────────────────────

export default function StudySetFormSB({ defaultValues }: StudySetFormSBProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [isPublic, setIsPublic] = useState(defaultValues?.isPublic ?? true);
  const [flashcards, setFlashcards] = useState<FlashcardField[]>(() => {
    if (defaultValues?.flashcards?.length) {
      return defaultValues.flashcards.map((f) => ({
        localId: genId(),
        id: f.id,
        term: f.term,
        definition: f.definition,
        position: f.position,
      }));
    }
    return Array.from({ length: INITIAL_COUNT }, (_, i) => makeEmpty(i));
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { mutate: create, isPending: isCreating } = useCreateStudySet();
  const { mutate: update, isPending: isUpdating } = useUpdateStudySet();
  const isPending = isCreating || isUpdating;

  // Scroll to bottom when flashcard count increases
  const prevLen = useRef(flashcards.length);
  useEffect(() => {
    if (flashcards.length > prevLen.current) {
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
    prevLen.current = flashcards.length;
  }, [flashcards.length]);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Tiêu đề không được để trống";
    const hasContent = flashcards.some((f) => f.term.trim() || f.definition.trim());
    if (!hasContent) errs.flashcards = "Cần ít nhất 1 thẻ học có nội dung";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Flashcard handlers ──────────────────────────────────────────────────────

  const addFlashcard = () => {
    setFlashcards((prev) => [...prev, makeEmpty(prev.length)]);
  };

  const removeFlashcard = (index: number) => {
    setFlashcards((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFlashcard = (
    index: number,
    field: "term" | "definition",
    value: string,
  ) => {
    setFlashcards((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    );
  };

  // Drag-and-drop reorder
  const onDragStart = (index: number) => setDragIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFlashcards((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved!);
      return next.map((f, i) => ({ ...f, position: i }));
    });
    setDragIndex(index);
  };
  const onDragEnd = () => setDragIndex(null);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const flashcardPayload: FlashcardRequest[] = flashcards
      .filter((f) => f.term.trim() || f.definition.trim())
      .map((f, i) => ({
        id: f.id,
        term: f.term,
        definition: f.definition,
        position: i,
      }));

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      isPublic,
      flashcards: flashcardPayload,
    };

    try {
      if (defaultValues) {
        await update(defaultValues.id, payload, {
          onSuccess: (res) => {
            router.push(`/study-sets/${res.id}`);
          },
        });
      } else {
        await create(payload, {
          onSuccess: (res) => {
            router.push(`/study-sets/${res.id}`);
          },
        });
      }
    } catch {
      // errors already shown via onError callbacks if needed
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {defaultValues ? "Chỉnh sửa học phần" : "Tạo học phần mới"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {defaultValues
            ? "Cập nhật tiêu đề, mô tả và các thẻ học."
            : "Điền tiêu đề, thêm thẻ học và lưu lại."}
        </p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
        {/* Title */}
        <div className="space-y-1">
          <label
            htmlFor="study-set-title"
            className="text-sm font-semibold text-foreground"
          >
            Tiêu đề <span className="text-destructive">*</span>
          </label>
          <input
            id="study-set-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            placeholder="Ví dụ: Từ vựng Tiếng Anh B1"
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.title ? "border-destructive" : "border-input"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="study-set-description"
            className="text-sm font-semibold text-foreground"
          >
            Mô tả <span className="text-muted-foreground font-normal">(tuỳ chọn)</span>
          </label>
          <textarea
            id="study-set-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Mô tả ngắn gọn về học phần này..."
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between rounded-lg border border-input bg-card px-4 py-3 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Hiển thị công khai</p>
            <p className="text-xs text-muted-foreground">
              Học phần {isPublic ? "hiển thị với mọi người" : "chỉ mình bạn thấy"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic((prev) => !prev)}
            className="text-primary transition hover:opacity-80"
            aria-label="Toggle visibility"
          >
            {isPublic ? (
              <ToggleRight size={36} className="text-primary" />
            ) : (
              <ToggleLeft size={36} className="text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Flashcards */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Thẻ học</h2>
              {errors.flashcards && (
                <p className="text-xs text-destructive">{errors.flashcards}</p>
              )}
            </div>
            
            {/* Excel Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  import("xlsx").then((XLSX) => {
                    const data = flashcards
                      .filter((f) => f.term.trim() || f.definition.trim())
                      .map((f) => ({ "Thuật ngữ": f.term, "Định nghĩa": f.definition }));
                    if (data.length === 0) {
                      data.push({ "Thuật ngữ": "", "Định nghĩa": "" });
                    }
                    const ws = XLSX.utils.json_to_sheet(data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Flashcards");
                    XLSX.writeFile(wb, `${title || "HocPhan"}.xlsx`);
                  });
                }}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/20"
                title="Xuất danh sách thẻ ra Excel"
              >
                <Download size={12} /> Xuất Excel
              </button>
              
              <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 transition hover:bg-blue-500/20">
                <Upload size={12} /> Nhập Excel
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    import("xlsx").then((XLSX) => {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        try {
                          const bstr = evt.target?.result;
                          const wb = XLSX.read(bstr, { type: "binary" });
                          const wsname = wb.SheetNames[0];
                          const ws = wb.Sheets[wsname!];
                          const data = XLSX.utils.sheet_to_json<any>(ws!, { header: 1 });
                          
                          // Skip header row if it looks like a header, otherwise parse all
                          const newFlashcards: FlashcardField[] = [];
                          let startIdx = 0;
                          if (
                            data.length > 0 &&
                            data[0] &&
                            (String(data[0][0]).toLowerCase().includes("thuật ngữ") ||
                              String(data[0][0]).toLowerCase().includes("term"))
                          ) {
                            startIdx = 1;
                          }
                          
                          for (let i = startIdx; i < data.length; i++) {
                            const row = data[i];
                            if (!row) continue;
                            const term = String(row[0] || "").trim();
                            const definition = String(row[1] || "").trim();
                            if (term || definition) {
                              newFlashcards.push({
                                localId: genId(),
                                term,
                                definition,
                                position: 0,
                              });
                            }
                          }
                          
                          if (newFlashcards.length > 0) {
                            setFlashcards((prev) => {
                              // Filter out completely empty cards from current state
                              const currentValid = prev.filter(f => f.term.trim() || f.definition.trim());
                              return [...currentValid, ...newFlashcards].map((f, idx) => ({...f, position: idx}));
                            });
                          }
                        } catch (err) {
                          alert("Lỗi khi đọc file Excel!");
                          console.error(err);
                        } finally {
                          e.target.value = ""; // reset
                        }
                      };
                      reader.readAsBinaryString(file);
                    });
                  }}
                />
              </label>
              
              <button
                type="button"
                onClick={() => {
                  import("xlsx").then((XLSX) => {
                    const ws = XLSX.utils.json_to_sheet([{ "Thuật ngữ": "Dog", "Định nghĩa": "Con chó" }, { "Thuật ngữ": "Cat", "Định nghĩa": "Con mèo" }]);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Mau");
                    XLSX.writeFile(wb, "Mau_HocPhan.xlsx");
                  });
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-card"
              >
                Tải mẫu Excel
              </button>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary ml-2">
                {flashcards.length} thẻ
              </span>
            </div>
          </div>

          <div ref={listRef} className="space-y-4">
            {flashcards.map((card, index) => (
              <div
                key={card.localId}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={`group relative rounded-xl border bg-card shadow-sm transition-all ${
                  dragIndex === index
                    ? "opacity-50 ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
              >
                {/* Card header */}
                <div className="flex items-center justify-between rounded-t-xl border-b bg-muted/40 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={16}
                      className="cursor-grab text-muted-foreground active:cursor-grabbing"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFlashcard(index)}
                    disabled={flashcards.length <= 1}
                    className="rounded-full p-1 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2Icon size={14} />
                  </button>
                </div>

                {/* Card body */}
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Thuật ngữ
                    </label>
                    <textarea
                      value={card.term}
                      onChange={(e) =>
                        updateFlashcard(index, "term", e.target.value)
                      }
                      disabled={isPending}
                      placeholder="Nhập thuật ngữ..."
                      rows={2}
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Định nghĩa
                    </label>
                    <textarea
                      value={card.definition}
                      onChange={(e) =>
                        updateFlashcard(index, "definition", e.target.value)
                      }
                      disabled={isPending}
                      placeholder="Nhập định nghĩa..."
                      rows={2}
                      className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add flashcard */}
          <button
            type="button"
            onClick={addFlashcard}
            disabled={isPending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-3 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:opacity-50"
          >
            <PlusIcon size={16} />
            Thêm thẻ học
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !isLoggedIn}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {defaultValues ? "Đang lưu..." : "Đang tạo..."}
            </>
          ) : (
            <>{defaultValues ? "💾 Lưu học phần" : "✨ Tạo học phần"}</>
          )}
        </button>

        {!isLoggedIn && (
          <p className="text-center text-sm text-muted-foreground">
            Bạn cần đăng nhập để lưu học phần.
          </p>
        )}
      </form>
    </div>
  );
}
