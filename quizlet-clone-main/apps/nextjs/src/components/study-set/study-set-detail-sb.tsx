"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Puzzle,
  Star,
  Trash2,
  FileText,
  Download,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { FlashcardResponse } from "~/lib/api-client";
import { flashcardApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";
import { useStudySet, useMyStudySets } from "~/hooks/use-study-sets";
import { useCreateFlashcard, useDeleteFlashcard, useUpdateFlashcard } from "~/hooks/use-flashcards";
import { useDeleteStudySet, useSetVisibility, useFavorites } from "~/hooks/use-study-sets";
import { useRouter } from "next/navigation";
import FlashcardMode from "~/components/flashcards-mode/flashcard-mode";

// ── Study Modes Config ─────────────────────────────────────────────────────────

const STUDY_MODES = [
  {
    icon: <Layers size={22} />,
    label: "Học thẻ",
    desc: "Lật thẻ và quẹt trái/phải để ôn từ",
    badge: "Cơ bản",
    badgeColor: "bg-violet-500/20 text-violet-300",
    href: (id: number) => `/study-sets/${id}/flashcards`,
    gradient: "from-violet-600 to-indigo-500",
    border: "border-violet-500/30 hover:border-violet-400/60",
  },
  {
    icon: <GraduationCap size={22} />,
    label: "Học thông minh",
    desc: "Spaced Repetition – hệ thống tự ưu tiên thẻ khó",
    badge: "Nâng cao",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    href: (id: number) => `/study-sets/${id}/learn`,
    gradient: "from-emerald-600 to-teal-500",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
  },
  {
    icon: <FileText size={22} />,
    label: "Kiểm tra",
    desc: "Trắc nghiệm nhiều lựa chọn, tự luận, đúng/sai",
    badge: "Luyện tập",
    badgeColor: "bg-amber-500/20 text-amber-300",
    href: (id: number) => `/study-sets/${id}/test`,
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-500/30 hover:border-amber-400/60",
  },
  {
    icon: <Puzzle size={22} />,
    label: "Ghép thẻ",
    desc: "Nối thuật ngữ với định nghĩa nhanh nhất",
    badge: "Vui",
    badgeColor: "bg-pink-500/20 text-pink-300",
    href: (id: number) => `/study-sets/${id}/match`,
    gradient: "from-pink-600 to-rose-500",
    border: "border-pink-500/30 hover:border-pink-400/60",
  },
];

// ── Flashcard Row (list view) ─────────────────────────────────────────────────

interface FlashcardRowProps {
  card: FlashcardResponse;
  index: number;
  onSaved: () => void;
  onDeleted: () => void;
}

function FlashcardRow({ card, index, onSaved, onDeleted }: FlashcardRowProps) {
  const [editing, setEditing] = useState(false);
  const [term, setTerm] = useState(card.term);
  const [definition, setDefinition] = useState(card.definition);
  const [confirmDel, setConfirmDel] = useState(false);
  const { mutate: update, isPending: isUpdating } = useUpdateFlashcard();
  const { mutate: del, isPending: isDeleting } = useDeleteFlashcard();

  const save = async () => {
    await update(card.id, { term, definition, studySetId: card.studySetId }, {
      onSuccess: () => { setEditing(false); onSaved(); },
    });
  };

  return (
    <div className="group relative rounded-2xl border border-border bg-card transition hover:border-border hover:bg-white/8">
      {/* Index badge */}
      <div className="absolute -left-3 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs font-bold text-muted-foreground shadow">
        {index + 1}
      </div>

      {editing ? (
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Thuật ngữ", value: term, set: setTerm },
              { label: "Định nghĩa", value: definition, set: setDefinition },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder-white/20 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setEditing(false); setTerm(card.term); setDefinition(card.definition); }}
              className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-card"
            >
              Huỷ
            </button>
            <button
              onClick={() => void save()}
              disabled={isUpdating}
              className="flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-violet-500 disabled:opacity-60"
            >
              {isUpdating && <Loader2 size={12} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 p-4">
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Thuật ngữ</p>
              <p className="text-sm font-medium text-foreground leading-relaxed">{card.term}</p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Định nghĩa</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.definition}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-card hover:text-violet-400"
              title="Chỉnh sửa"
            >
              <Edit size={14} />
            </button>
            {confirmDel ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => void del(card.id, { onSuccess: onDeleted })}
                  disabled={isDeleting}
                  className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition"
                  title="Xác nhận xoá"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
                <button
                  onClick={() => setConfirmDel(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-card text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDel(true)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition"
                title="Xoá"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Flashcard Form ─────────────────────────────────────────────────────────

function AddFlashcardForm({ studySetId, onAdded }: { studySetId: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const { mutate: create, isPending } = useCreateFlashcard();

  const submit = async () => {
    if (!term.trim() && !definition.trim()) return;
    await create({ term, definition, studySetId }, {
      onSuccess: () => { setTerm(""); setDefinition(""); setOpen(false); onAdded(); },
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition hover:border-violet-500/40 hover:text-violet-400"
      >
        <Plus size={16} />
        Thêm thẻ mới
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 space-y-3"
    >
      <h4 className="text-sm font-bold text-foreground">✨ Thêm thẻ mới</h4>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Thuật ngữ", value: term, set: setTerm, ph: "Nhập thuật ngữ..." },
          { label: "Định nghĩa", value: definition, set: setDefinition, ph: "Nhập định nghĩa..." },
        ].map(({ label, value, set, ph }) => (
          <div key={label}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
            <textarea
              value={value}
              onChange={(e) => set(e.target.value)}
              rows={3}
              placeholder={ph}
              className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder-white/20 focus:border-violet-500/60 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setOpen(false); setTerm(""); setDefinition(""); }} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-card">
          Huỷ
        </button>
        <button
          onClick={() => void submit()}
          disabled={isPending}
          className="flex items-center gap-1 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-violet-500 disabled:opacity-60"
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          Thêm thẻ
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

type ActiveTab = "flashcards" | "list";

export default function StudySetDetailSB({ studySetId }: { studySetId: number }) {
  const { user } = useAuth();
  const { data: studySet, isLoading, error, refetch } = useStudySet(studySetId);
  const { mutate: deleteSet, isPending: isDeleting } = useDeleteStudySet();
  const { mutate: setVisibility, isPending: isTogglingVisibility } = useSetVisibility();
  const { data: mySets } = useMyStudySets();
  const { data: myFavorites, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("flashcards");

  const isFavorited = myFavorites.some(set => set.id === studySetId);

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-10">
        <div className="h-9 w-2/3 animate-pulse rounded-xl bg-card" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-card" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-card" />)}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-card" />
      </div>
    );
  }

  if (error || !studySet) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-muted-foreground">{error ?? "Không tìm thấy học phần."}</p>
        <button onClick={() => router.push("/my-sets")} className="mt-4 rounded-xl bg-card px-4 py-2 text-sm text-foreground hover:bg-muted">
          Quay về trang chính
        </button>
      </div>
    );
  }

  const isOwner = mySets?.some((set) => set.id === studySet.id) ?? false;

  const handleDelete = async () => {
    await deleteSet(studySet.id, { onSuccess: () => router.push("/my-sets") });
  };

  const handleToggleVisibility = async () => {
    await setVisibility(studySet.id, !studySet.isPublic, {
      onSuccess: () => void refetch(),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black tracking-tight text-foreground leading-tight">
            {studySet.title}
          </h1>
          {studySet.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{studySet.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">@{studySet.username}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              {studySet.isPublic
                ? <><Eye size={11} className="text-emerald-400" /> <span className="text-emerald-400">Công khai</span></>
                : <><EyeOff size={11} /> Riêng tư</>}
            </span>
            <span>·</span>
            <button 
              onClick={() => toggleFavorite(studySet.id, isFavorited)}
              className="flex items-center gap-1.5 transition hover:text-foreground"
            >
              <Star size={12} className={isFavorited ? "text-amber-400 fill-amber-400" : ""} />
              <span>{studySet.favoriteCount} yêu thích</span>
            </button>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Layers size={11} />
              {studySet.flashcards.length} thẻ
            </span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            <button
              onClick={() => void handleToggleVisibility()}
              disabled={isTogglingVisibility}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-card disabled:opacity-60"
            >
              {isTogglingVisibility ? (
                <Loader2 size={12} className="animate-spin" />
              ) : studySet.isPublic ? (
                <><Eye size={12} /> Công khai</>
              ) : (
                <><EyeOff size={12} /> Riêng tư</>
              )}
            </button>

            <Link
              href={`/study-sets/${studySet.id}/edit`}
              className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/20"
            >
              <Edit size={12} /> Chỉnh sửa
            </Link>

            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                  className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-red-500 disabled:opacity-60"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Xác nhận xoá
                </button>
                <button onClick={() => setConfirmDelete(false)} className="rounded-xl px-2 py-1.5 text-xs text-muted-foreground hover:bg-card">
                  Huỷ
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={12} /> Xoá
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Study Modes Grid ── */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Chọn chế độ học
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STUDY_MODES.map(({ emoji, icon, label, desc, badge, badgeColor, href, gradient, border }) => (
            <Link
              key={label}
              href={href(studySet.id)}
              className={`group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:bg-card hover:shadow-lg ${border}`}
            >
              {/* Icon */}
              <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-foreground shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>

              {/* Label */}
              <div className="flex items-start justify-between gap-1">
                <p className="text-sm font-bold text-foreground leading-tight">{label}</p>
                <span className="text-lg leading-none">{emoji}</span>
              </div>

              {/* Desc */}
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>

              {/* Badge */}
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColor}`}>
                {badge}
              </span>

              {/* Arrow */}
              <ChevronRight size={14} className="absolute right-3 top-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-2xl bg-card p-1.5">
        {[
          { key: "flashcards" as const, label: "🎴 Xem thẻ nhanh", count: null },
          { key: "list" as const, label: "📋 Danh sách thẻ", count: studySet.flashcards.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === key
              ? "bg-muted text-foreground shadow"
              : "text-muted-foreground hover:text-muted-foreground"
              }`}
          >
            {label}
            {count !== null && (
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === key ? "bg-muted text-foreground" : "bg-card text-muted-foreground"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">

        {/* Flashcard viewer tab */}
        {activeTab === "flashcards" && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {studySet.flashcards.length > 0 ? (
              <FlashcardMode studySetId={studySet.id} />
            ) : (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="text-5xl">📭</div>
                <p className="text-muted-foreground">Học phần này chưa có thẻ nào.</p>
                {isOwner && (
                  <Link
                    href={`/study-sets/${studySet.id}/edit`}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-violet-500"
                  >
                    <Plus size={16} /> Thêm thẻ ngay
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* List tab */}
        {activeTab === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            {studySet.flashcards.length === 0 && !isOwner && (
              <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
                <div className="text-5xl">📭</div>
                <p>Học phần này chưa có thẻ nào.</p>
              </div>
            )}

            {studySet.flashcards.map((card, idx) => (
              <FlashcardRow
                key={card.id}
                card={card}
                index={idx}
                onSaved={() => void refetch()}
                onDeleted={() => void refetch()}
              />
            ))}

            {isOwner && (
              <AddFlashcardForm
                studySetId={studySet.id}
                onAdded={() => void refetch()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
