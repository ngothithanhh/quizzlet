"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Shuffle,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";

import type { FlashcardResponse } from "~/lib/api-client";
import { flashcardApi } from "~/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

type StudyMode = "browse" | "sort";

interface FlashcardModeState {
  cards: FlashcardResponse[];
  index: number;
  hard: FlashcardResponse[];
  mode: StudyMode;
  isCompleted: boolean;
  autoPlayAudio: boolean;
  ttsLanguage: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  NEW: { label: "Mới", color: "bg-sky-500/20 text-sky-400" },
  LEARNING: { label: "Đang học", color: "bg-amber-500/20 text-amber-400" },
  REVIEW: { label: "Ôn tập", color: "bg-violet-500/20 text-violet-400" },
  MASTERED: { label: "Thành thạo", color: "bg-emerald-500/20 text-emerald-400" },
};

// ── Flip Card ─────────────────────────────────────────────────────────────────

interface FlipCardProps {
  card: FlashcardResponse;
  fullscreen?: boolean;
  sortMode?: boolean;
  autoPlayAudio?: boolean;
  ttsLanguage?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

function FlipCard({ card, fullscreen, sortMode, autoPlayAudio, ttsLanguage, onSwipeLeft, onSwipeRight }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 0, 200], [-14, 0, 14]);
  const leftOpacity = useTransform(dragX, [-140, -30], [1, 0]);
  const rightOpacity = useTransform(dragX, [30, 140], [0, 1]);

  const SWIPE_THRESHOLD = 90;

  const handleDragEnd = async (_: unknown, info: { offset: { x: number } }) => {
    const ox = info.offset.x;
    if (ox < -SWIPE_THRESHOLD && sortMode) {
      await animate(dragX, -window.innerWidth, { duration: 0.25 });
      dragX.set(0);
      setFlipped(false);
      onSwipeLeft?.();
    } else if (ox > SWIPE_THRESHOLD && sortMode) {
      await animate(dragX, window.innerWidth, { duration: 0.25 });
      dragX.set(0);
      setFlipped(false);
      onSwipeRight?.();
    } else {
      void animate(dragX, 0, { duration: 0.25, ease: "easeOut" });
    }
  };

  const minH = fullscreen ? "min-h-[44rem]" : "min-h-[22rem] sm:min-h-[26rem]";

  const termImage = card.mediaList?.find(m => m.side === "TERM" && m.type === "IMAGE");
  const termAudio = card.mediaList?.find(m => m.side === "TERM" && m.type === "AUDIO");
  const defImage = card.mediaList?.find(m => m.side === "DEFINITION" && m.type === "IMAGE");
  const defAudio = card.mediaList?.find(m => m.side === "DEFINITION" && m.type === "AUDIO");

  const playAudio = (e: React.MouseEvent | null, text: string, url?: string) => {
    if (e) e.stopPropagation();
    if (url) {
      new Audio(url).play().catch(console.error);
    } else if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (ttsLanguage) utterance.lang = ttsLanguage;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (autoPlayAudio) {
      if (flipped) {
        playAudio(null, card.definition, defAudio?.url);
      } else {
        playAudio(null, card.term, termAudio?.url);
      }
    }
  }, [flipped, autoPlayAudio, card]);

  return (
    <div className={`relative w-full ${minH}`} style={{ perspective: 1200 }}>
      {/* Swipe feedback */}
      {sortMode && (
        <>
          <motion.div
            style={{ opacity: leftOpacity }}
            className="pointer-events-none absolute left-4 top-6 z-20 rounded-xl border-4 border-red-500 px-4 py-2 font-black text-red-500 text-xl select-none"
          >
            ✕ Chưa biết
          </motion.div>
          <motion.div
            style={{ opacity: rightOpacity }}
            className="pointer-events-none absolute right-4 top-6 z-20 rounded-xl border-4 border-emerald-500 px-4 py-2 font-black text-emerald-500 text-xl select-none"
          >
            Biết rồi ✓
          </motion.div>
        </>
      )}

      <motion.div
        ref={cardRef}
        drag={sortMode ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        style={{ x: dragX, rotate }}
        onDragEnd={handleDragEnd}
        onClick={() => setFlipped((f) => !f)}
        className="absolute inset-0 cursor-pointer select-none [transform-style:preserve-3d]"
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl [backface-visibility:hidden] flex flex-col p-6 text-slate-50">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Thuật ngữ
            </span>
            {/* Render audio button regardless of termAudio existing */}
            <button
              onClick={(e) => playAudio(e, card.term, termAudio?.url)}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              title="Phát âm thanh"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-4 overflow-y-auto mt-2">
            {termImage && (
              <img src={termImage.url} alt="term" className="max-h-32 object-contain mb-4 rounded-md shadow-sm" />
            )}
            <p className={`text-center font-bold leading-relaxed text-white ${card.term.length > 80 ? "text-xl" : card.term.length > 40 ? "text-2xl" : "text-3xl"}`}>
              {card.term}
            </p>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">Nhấp để xem định nghĩa</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-800 shadow-2xl [backface-visibility:hidden] flex flex-col p-6 text-primary-foreground"
          style={{ transform: "rotateX(180deg)" }}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Định nghĩa
            </span>
            {/* Render audio button regardless of defAudio existing */}
            <button
              onClick={(e) => playAudio(e, card.definition, defAudio?.url)}
              className="rounded-full p-2 text-primary-foreground transition hover:bg-black/10"
              title="Phát âm thanh"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-4 overflow-y-auto mt-2">
            {defImage && (
              <img src={defImage.url} alt="definition" className="max-h-32 object-contain mb-4 rounded-md shadow-sm" />
            )}
            <p className={`text-center text-white font-bold leading-relaxed ${card.definition.length > 80 ? "text-xl" : card.definition.length > 40 ? "text-2xl" : "text-3xl"}`}>
              {card.definition}
            </p>
          </div>
          <p className="text-center text-xs text-primary-foreground/70 mt-2">Nhấp để xem thuật ngữ</p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Settings Dropdown ─────────────────────────────────────────────────────────

interface SettingsPanelProps {
  mode: StudyMode;
  onToggleMode: () => void;
  onShuffle: () => void;
  onReset: () => void;
  autoPlayAudio: boolean;
  onToggleAutoPlay: () => void;
  ttsLanguage: string;
  onChangeTtsLanguage: (lang: string) => void;
}

function SettingsPanel({ mode, onToggleMode, onShuffle, onReset, autoPlayAudio, onToggleAutoPlay, ttsLanguage, onChangeTtsLanguage }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-card hover:text-foreground"
        title="Cài đặt"
      >
        <Settings size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-border bg-slate-800 shadow-2xl"
            >
              <div className="p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cài đặt thẻ</p>

                {/* Sort mode toggle */}
                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Phân loại thẻ</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Quẹt để phân loại Biết / Chưa biết</p>
                  </div>
                  <button
                    onClick={onToggleMode}
                    className={`relative h-6 w-11 rounded-full transition-colors ${mode === "sort" ? "bg-violet-600" : "bg-muted"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${mode === "sort" ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tự động đọc thẻ</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Phát âm thanh khi xem</p>
                  </div>
                  <button
                    onClick={onToggleAutoPlay}
                    className={`relative h-6 w-11 rounded-full transition-colors ${autoPlayAudio ? "bg-violet-600" : "bg-muted"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoPlayAudio ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>

                <div className="mt-2 flex flex-col justify-center rounded-xl bg-card px-4 py-3">
                  <p className="text-sm font-semibold text-foreground mb-2">Ngôn ngữ đọc</p>
                  <select 
                    value={ttsLanguage} 
                    onChange={(e) => onChangeTtsLanguage(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="vi-VN">Tiếng Việt</option>
                    <option value="en-US">Tiếng Anh</option>
                    <option value="fr-FR">Tiếng Pháp</option>
                    <option value="ja-JP">Tiếng Nhật</option>
                    <option value="ko-KR">Tiếng Hàn</option>
                    <option value="zh-CN">Tiếng Trung</option>
                  </select>
                </div>

                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => { onShuffle(); setOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
                  >
                    <Shuffle size={16} /> Xáo trộn thẻ
                  </button>
                  <button
                    onClick={() => { onReset(); setOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    <RotateCcw size={16} /> Bắt đầu lại
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Completed Screen ──────────────────────────────────────────────────────────

interface CompletedProps {
  hardCount: number;
  total: number;
  onReviewHard: () => void;
  onReset: () => void;
}

function CompletedScreen({ hardCount, total, onReviewHard, onReset }: CompletedProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <div className="text-7xl">🎉</div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Hoàn thành!</h2>
        <p className="mt-2 text-muted-foreground">
          Bạn đã học qua tất cả {total} thẻ.
          {hardCount > 0 && ` Còn ${hardCount} thẻ chưa thuộc.`}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {hardCount > 0 && (
          <button
            onClick={onReviewHard}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-primary-foreground transition hover:bg-amber-600"
          >
            <RotateCcw size={18} /> Ôn lại {hardCount} thẻ khó
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-card px-6 py-3 font-semibold text-foreground transition hover:bg-muted"
        >
          <RotateCcw size={18} /> Học lại từ đầu
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface FlashcardModeProps {
  studySetId: number;
  fullscreen?: boolean;
}

export default function FlashcardMode({ studySetId, fullscreen }: FlashcardModeProps) {
  const [allCards, setAllCards] = useState<FlashcardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<FlashcardModeState>({
    cards: [],
    index: 0,
    hard: [],
    mode: "browse",
    isCompleted: false,
    autoPlayAudio: false,
    ttsLanguage: "vi-VN",
  });

  // Fetch cards
  useEffect(() => {
    setIsLoading(true);
    flashcardApi
      .getByStudySet(studySetId)
      .then((data) => {
        setAllCards(data);
        setState((s) => ({ ...s, cards: data, index: 0, hard: [], isCompleted: false }));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [studySetId]);

  const currentCard = state.cards[state.index];
  const progress = state.cards.length > 0
    ? (state.index / state.cards.length) * 100
    : 0;

  const goLeft = useCallback(() => {
    if (state.mode === "sort") {
      // Mark as hard → remove from deck, add to hard list
      setState((s) => {
        const card = s.cards[s.index]!;
        const newCards = s.cards.filter((_, i) => i !== s.index);
        const newIndex = Math.min(s.index, newCards.length - 1);
        return {
          ...s,
          cards: newCards,
          index: newIndex < 0 ? 0 : newIndex,
          hard: [...s.hard, card],
          isCompleted: newCards.length === 0,
        };
      });
    } else {
      setState((s) => ({ ...s, index: Math.max(0, s.index - 1) }));
    }
  }, [state.mode]);

  const goRight = useCallback(() => {
    if (state.mode === "sort") {
      // Mark as known → just remove from deck
      setState((s) => {
        const newCards = s.cards.filter((_, i) => i !== s.index);
        const newIndex = Math.min(s.index, newCards.length - 1);
        return {
          ...s,
          cards: newCards,
          index: newIndex < 0 ? 0 : newIndex,
          isCompleted: newCards.length === 0,
        };
      });
    } else {
      setState((s) => ({
        ...s,
        index: Math.min(s.cards.length, s.index + 1),
        isCompleted: s.index + 1 >= s.cards.length,
      }));
    }
  }, [state.mode]);

  const handleShuffle = () => {
    setState((s) => ({ ...s, cards: shuffleArray(s.cards), index: 0 }));
  };

  const handleReset = () => {
    setState({
      cards: allCards,
      index: 0,
      hard: [],
      mode: state.mode,
      isCompleted: false,
      autoPlayAudio: state.autoPlayAudio,
      ttsLanguage: state.ttsLanguage,
    });
  };

  const handleReviewHard = () => {
    setState((s) => ({
      ...s,
      cards: s.hard,
      index: 0,
      hard: [],
      isCompleted: false,
    }));
  };

  const handleToggleMode = () => {
    setState((s) => ({
      ...s,
      mode: s.mode === "browse" ? "sort" : "browse",
    }));
  };

  const handleToggleAutoPlay = () => {
    setState((s) => ({
      ...s,
      autoPlayAudio: !s.autoPlayAudio,
    }));
  };

  const handleChangeTtsLanguage = (lang: string) => {
    setState((s) => ({
      ...s,
      ttsLanguage: lang,
    }));
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className={`w-full animate-pulse rounded-2xl bg-card ${fullscreen ? "min-h-[44rem]" : "min-h-[22rem] sm:min-h-[26rem]"}`} />
        <div className="flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-10 animate-pulse rounded-full bg-card" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-red-400">
        <p className="font-semibold">Không thể tải thẻ</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // ── Empty ──
  if (allCards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <p className="text-lg font-semibold">Học phần này chưa có thẻ nào</p>
      </div>
    );
  }

  // ── Completed ──
  if (state.isCompleted || (!currentCard && state.mode === "browse")) {
    return (
      <CompletedScreen
        hardCount={state.hard.length}
        total={allCards.length}
        onReviewHard={handleReviewHard}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Sort mode banner */}
      <AnimatePresence>
        {state.mode === "sort" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300"
          >
            <span>Quẹt thẻ: ← Chưa biết · Biết rồi →</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flip card */}
      {currentCard && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentCard.id}-${state.index}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <FlipCard
              card={currentCard}
              fullscreen={fullscreen}
              sortMode={state.mode === "sort"}
              autoPlayAudio={state.autoPlayAudio}
              ttsLanguage={state.ttsLanguage}
              onSwipeLeft={goLeft}
              onSwipeRight={goRight}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 backdrop-blur-sm">
        {/* Shuffle */}
        <button
          onClick={handleShuffle}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-card hover:text-foreground"
          title="Xáo trộn"
        >
          <Shuffle size={18} />
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goLeft}
            disabled={state.mode === "browse" && state.index === 0}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold transition disabled:opacity-30 ${state.mode === "sort"
              ? "border-red-500/40 text-red-400 hover:border-red-500 hover:bg-red-500/10"
              : "border-border text-muted-foreground hover:border-border0 hover:text-foreground"
              }`}
            title={state.mode === "sort" ? "Chưa biết" : "Thẻ trước"}
          >
            {state.mode === "sort" ? <X size={20} /> : <ArrowLeft size={20} />}
          </button>

          <span className="min-w-[3.5rem] text-center text-sm font-semibold tabular-nums text-muted-foreground">
            {state.mode === "browse"
              ? `${state.index + 1} / ${state.cards.length}`
              : `${state.cards.length} thẻ`}
          </span>

          <button
            onClick={goRight}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold transition ${state.mode === "sort"
              ? "border-emerald-500/40 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10"
              : "border-border text-muted-foreground hover:border-border0 hover:text-foreground"
              }`}
            title={state.mode === "sort" ? "Biết rồi" : "Thẻ tiếp"}
          >
            {state.mode === "sort" ? <Check size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>

        {/* Settings + Fullscreen */}
        <div className="flex items-center gap-1">
          <SettingsPanel
            mode={state.mode}
            onToggleMode={handleToggleMode}
            onShuffle={handleShuffle}
            onReset={handleReset}
            autoPlayAudio={state.autoPlayAudio}
            onToggleAutoPlay={handleToggleAutoPlay}
            ttsLanguage={state.ttsLanguage}
            onChangeTtsLanguage={handleChangeTtsLanguage}
          />
          {!fullscreen && (
            <Link
              href={`/study-sets/${studySetId}/flashcards`}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-card hover:text-foreground"
              title="Toàn màn hình"
            >
              <Maximize2 size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% hoàn thành</span>
          {state.mode === "sort" && state.hard.length > 0 && (
            <span className="text-amber-400">{state.hard.length} chưa biết</span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-card">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
