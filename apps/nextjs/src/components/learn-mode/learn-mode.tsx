"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import type { LearnCardResponse, LearnResult } from "~/lib/learn-api-client";
import { learnApi } from "~/lib/learn-api-client";

// ── Status badge config ────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  NEW: { label: "Mới", className: "bg-sky-500/20 text-sky-400" },
  LEARNING: { label: "Đang học", className: "bg-amber-500/20 text-amber-400" },
  REVIEW: { label: "Ôn tập", className: "bg-violet-500/20 text-violet-400" },
  MASTERED: { label: "Thành thạo", className: "bg-emerald-500/20 text-emerald-400" },
} as const;

// ── Result button config ───────────────────────────────────────────────────────

const RESULT_BUTTONS: {
  result: LearnResult;
  label: string;
  sub: string;
  className: string;
  icon: React.ReactNode;
}[] = [
  {
    result: "AGAIN",
    label: "Học lại",
    sub: "Không nhớ",
    className: "border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500",
    icon: <XCircle size={18} />,
  },
  {
    result: "HARD",
    label: "Khó",
    sub: "Nhớ nhưng khó",
    className: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500",
    icon: <Brain size={18} />,
  },
  {
    result: "GOOD",
    label: "Tốt",
    sub: "Nhớ được",
    className: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500",
    icon: <CheckCircle2 size={18} />,
  },
  {
    result: "EASY",
    label: "Dễ",
    sub: "Rất dễ nhớ",
    className: "border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500",
    icon: <Zap size={18} />,
  },
];

// ── Memory Level Bar ───────────────────────────────────────────────────────────

function MemoryBar({ level }: { level: number }) {
  const pct = Math.min(100, (level / 10) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Ghi nhớ</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Completed Screen ───────────────────────────────────────────────────────────

function CompletedScreen({
  total,
  masteredCount,
  onRestart,
  studySetId,
}: {
  total: number;
  masteredCount: number;
  onRestart: () => void;
  studySetId: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-20 text-center"
    >
      <div className="text-8xl">🎓</div>
      <div>
        <h2 className="text-3xl font-black text-foreground">Xuất sắc!</h2>
        <p className="mt-2 text-muted-foreground">
          Bạn vừa hoàn thành một phiên học.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card px-6 py-4 text-center">
          <p className="text-3xl font-black text-emerald-400">{masteredCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Thành thạo</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-4 text-center">
          <p className="text-3xl font-black text-violet-400">{total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tổng số thẻ</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-primary-foreground transition hover:bg-violet-500"
        >
          <RotateCcw size={18} /> Học lại
        </button>
        <Link
          href={`/study-sets/${studySetId}`}
          className="flex items-center gap-2 rounded-xl bg-card px-6 py-3 font-semibold text-foreground transition hover:bg-muted"
        >
          <ArrowLeft size={18} /> Về học phần
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface LearnModeProps {
  studySetId: number;
}

export default function LearnMode({ studySetId }: LearnModeProps) {
  const [cards, setCards] = useState<LearnCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionMastered, setSessionMastered] = useState(0);
  const [initialTotal, setInitialTotal] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const fetchCards = useCallback(() => {
    setIsLoading(true);
    setError(null);
    learnApi
      .getCards(studySetId)
      .then((data) => {
        setCards(data);
        setInitialTotal(data.length);
        setIndex(0);
        setRevealed(false);
        setCompleted(data.length === 0);
        setSessionMastered(0);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [studySetId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const currentCard = cards[index];
  const progress = initialTotal > 0 ? (sessionMastered / initialTotal) * 100 : 0;

  const handleSubmit = async (result: LearnResult) => {
    if (!currentCard || submitting) return;
    setSubmitting(true);

    let nextCards = [...cards];
    let isMastered = result === "EASY";

    try {
      await learnApi.submit({ flashcardId: currentCard.flashcardId, result });
    } catch {
      // Non-blocking – continue even if submit fails locally
    }

    if (isMastered) {
      setSessionMastered((m) => m + 1);
    } else {
      // Re-queue the card at the end of the deck
      nextCards.push(currentCard);
    }
    
    setCards(nextCards);

    setDirection(1);
    const nextIndex = index + 1;
    if (nextIndex >= nextCards.length) {
      setCompleted(true);
    } else {
      setIndex(nextIndex);
      setRevealed(false);
    }
    setSubmitting(false);
  };

  const handleRestart = async () => {
    setIsLoading(true);
    try {
      await learnApi.reset(studySetId);
    } catch {
      // Non-blocking
    }
    setCompleted(false);
    fetchCards();
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-2 w-full animate-pulse rounded-full bg-card" />
        <div className="min-h-[22rem] w-full animate-pulse rounded-2xl bg-card" />
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center text-red-400">
        <XCircle size={40} />
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchCards}
          className="rounded-xl bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // ── All mastered ──
  if (cards.length === 0 || completed) {
    return (
      <CompletedScreen
        total={cards.length}
        masteredCount={sessionMastered}
        onRestart={handleRestart}
        studySetId={studySetId}
      />
    );
  }

  const statusCfg = currentCard
    ? STATUS_CONFIG[currentCard.studyStatus] ?? STATUS_CONFIG.NEW
    : STATUS_CONFIG.NEW;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{sessionMastered} / {initialTotal} thẻ (hoàn thành)</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-card">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={`card-${currentCard.flashcardId}-${index}`}
            initial={{ opacity: 0, x: direction * 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 60, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              onClick={() => !revealed && setRevealed(true)}
              className={`relative min-h-[22rem] w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl text-foreground ${
                !revealed ? "cursor-pointer" : ""
              }`}
            >
              {/* Header: status + memory */}
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.className}`}>
                  {statusCfg.label}
                </span>
                <MemoryBar level={currentCard.memoryLevel} />
              </div>

              {/* Term */}
              <div className="mb-6 rounded-xl bg-card p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Thuật ngữ
                </p>
                <p className={`font-bold leading-relaxed ${currentCard.term.length > 60 ? "text-xl" : "text-2xl"}`}>
                  {currentCard.term}
                </p>
              </div>

              {/* Definition – revealed or hint */}
              <AnimatePresence mode="wait">
                {revealed ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-5"
                  >
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
                      Định nghĩa
                    </p>
                    <p className={`font-bold leading-relaxed text-foreground ${currentCard.definition.length > 60 ? "text-xl" : "text-2xl"}`}>
                      {currentCard.definition}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hidden"
                    className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-muted-foreground transition hover:border-border hover:text-muted-foreground"
                  >
                    <span className="text-sm font-medium">Nhấp để xem định nghĩa</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Priority score */}
              {currentCard.priorityScore > 0 && (
                <div className="mt-3 flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    Ưu tiên: {currentCard.priorityScore.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result buttons */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-3"
          >
            <p className="text-center text-xs font-medium text-muted-foreground">
              Bạn nhớ thẻ này như thế nào?
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RESULT_BUTTONS.map(({ result, label, sub, className, icon }) => (
                <button
                  key={result}
                  onClick={() => void handleSubmit(result)}
                  disabled={submitting}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 font-semibold transition disabled:opacity-50 ${className}`}
                >
                  {icon}
                  <span className="text-sm">{label}</span>
                  <span className="text-xs opacity-60">{sub}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      {!revealed && (
        <p className="text-center text-xs text-muted-foreground">
          Nhấp vào thẻ để xem định nghĩa
        </p>
      )}
    </div>
  );
}
