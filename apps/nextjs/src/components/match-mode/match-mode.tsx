"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Puzzle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type { FlashcardResponse, MatchCardResponse, MatchStartResponse } from "~/lib/api-client";
import { flashcardApi, matchApi } from "~/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────────────────

interface MatchCard {
  id: string;           // unique card id
  flashcardId: number;  // used to find pair
  content: string;
  side: "term" | "definition";
}

type Screen = "start" | "play" | "result";

// ── Helpers ────────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const MAX_PAIRS = 6; // max pairs at once for playability

function buildCards(flashcards: FlashcardResponse[]): MatchCard[] {
  const sample = shuffle(flashcards).slice(0, MAX_PAIRS);
  return buildCardsFromBatch(sample.map(f => ({ flashcardId: f.id, term: f.term, definition: f.definition })));
}

function buildCardsFromBatch(batch: MatchCardResponse[]): MatchCard[] {
  const cards: MatchCard[] = batch.flatMap((f) => [
    { id: `t-${f.flashcardId}`, flashcardId: f.flashcardId, content: f.term, side: "term" as const },
    { id: `d-${f.flashcardId}`, flashcardId: f.flashcardId, content: f.definition, side: "definition" as const },
  ]);
  return shuffle(cards);
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

// ── Start Screen ───────────────────────────────────────────────────────────────

function StartScreen({ total, onStart }: { total: number; onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-20 text-center"
    >
      <div className="text-7xl">🧩</div>
      <div>
        <h2 className="text-2xl font-black text-foreground">Ghép thẻ</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Nối {Math.min(total, MAX_PAIRS)} cặp thuật ngữ – định nghĩa nhanh nhất có thể!
        </p>
      </div>
      <div className="flex gap-6 text-center">
        <div className="rounded-2xl bg-card px-6 py-4">
          <p className="text-2xl font-black text-violet-400">{Math.min(total, MAX_PAIRS)}</p>
          <p className="text-xs text-muted-foreground mt-1">Cặp thẻ</p>
        </div>
        <div className="rounded-2xl bg-card px-6 py-4">
          <p className="text-2xl font-black text-amber-400">{Math.min(total, MAX_PAIRS) * 2}</p>
          <p className="text-xs text-muted-foreground mt-1">Ô cần nối</p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-primary-foreground shadow-2xl shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500"
      >
        <Puzzle size={20} /> Bắt đầu ghép!
      </button>
    </motion.div>
  );
}

// ── End Screen ─────────────────────────────────────────────────────────────────

function EndScreen({
  elapsed,
  score,
  onReset,
  studySetId,
}: {
  elapsed: number;
  score: number;
  onReset: () => void;
  studySetId: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-20 text-center"
    >
      <div className="text-7xl">🏆</div>
      <div>
        <h2 className="text-2xl font-black text-foreground">Hoàn thành!</h2>
        <p className="mt-2 text-muted-foreground">Bạn đã ghép hết tất cả các thẻ!</p>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4">
          <Clock size={22} className="text-amber-400" />
          <div className="text-left">
            <p className="text-xs text-amber-400/60 font-medium">Thời gian</p>
            <p className="text-2xl font-black text-amber-400">{formatTime(elapsed)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-6 py-4">
          <Trophy size={22} className="text-emerald-400" />
          <div className="text-left">
            <p className="text-xs text-emerald-400/60 font-medium">Điểm số</p>
            <p className="text-2xl font-black text-emerald-400">{score}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-violet-500"
        >
          <RotateCcw size={16} /> Chơi lại
        </button>
        <Link
          href={`/study-sets/${studySetId}`}
          className="flex items-center gap-2 rounded-xl bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft size={16} /> Về học phần
        </Link>
      </div>
    </motion.div>
  );
}

// ── Memory Card ────────────────────────────────────────────────────────────────

interface MemCardProps {
  card: MatchCard;
  isSelected: boolean;
  isMatched: boolean;
  isMismatched: boolean;
  onClick: () => void;
}

function MemCard({ card, isSelected, isMatched, isMismatched, onClick }: MemCardProps) {
  const baseClass =
    "relative min-h-[6rem] cursor-pointer rounded-2xl border-2 p-4 text-center text-sm font-semibold transition-all select-none flex items-center justify-center";

  const stateClass = isMatched
    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 scale-95 opacity-40 cursor-default"
    : isMismatched
      ? "border-red-500 bg-red-500/10 text-red-400 animate-shake"
      : isSelected
        ? card.side === "term"
          ? "border-violet-500 bg-violet-500/15 text-primary-foreground shadow-lg shadow-violet-500/20 scale-[1.02]"
          : "border-indigo-400 bg-indigo-500/15 text-primary-foreground shadow-lg shadow-indigo-500/20 scale-[1.02]"
        : card.side === "term"
          ? "border-border bg-card text-muted-foreground hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-primary-foreground";

  return (
    <motion.div
      layout
      whileTap={{ scale: isMatched ? 1 : 0.97 }}
      onClick={() => !isMatched && onClick()}
      className={`${baseClass} ${stateClass}`}
    >
      {/* Side indicator */}
      <span className={`absolute top-2 left-2 text-xs opacity-40 font-normal ${card.side === "term" ? "text-violet-400" : "text-indigo-400"}`}>
        {card.side === "term" ? "Thuật ngữ" : "Định nghĩa"}
      </span>
      <span className="leading-snug">{card.content}</span>
    </motion.div>
  );
}

// ── Timer Hook ─────────────────────────────────────────────────────────────────

function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setElapsed((e) => e + 100), 100);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const reset = () => setElapsed(0);
  return { elapsed, reset };
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function MatchMode({ studySetId }: { studySetId: number }) {
  const [allCards, setAllCards] = useState<FlashcardResponse[]>([]);
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("start");

  const [sessionData, setSessionData] = useState<MatchStartResponse | null>(null);
  const [score, setScore] = useState(0);

  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [mismatched, setMismatched] = useState<string[]>([]);

  // Refs to hold the mutable game state — avoids stale closures entirely
  const poolRef = useRef<MatchCardResponse[]>([]);
  const matchCardsRef = useRef<MatchCard[]>([]);
  const matchedRef = useRef<string[]>([]);

  const { elapsed, reset: resetTimer } = useTimer(screen === "play");

  const loadCards = useCallback(() => {
    setIsLoading(true);
    flashcardApi
      .getByStudySet(studySetId)
      .then((data) => {
        setAllCards(data);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [studySetId]);

  useEffect(() => { loadCards(); }, [loadCards]);

  // Check pair when 2 cards selected
  useEffect(() => {
    if (selected.length !== 2 || !sessionData) return;

    const [id1, id2] = selected;
    const c1 = matchCards.find((c) => c.id === id1);
    const c2 = matchCards.find((c) => c.id === id2);

    if (c1 && c2) {
      const termContent = c1.side === "term" ? c1.content : c2.content;
      const defContent = c1.side === "definition" ? c1.content : c2.content;

      matchApi.answer({
        matchSessionId: sessionData.matchSessionId,
        flashcardId: c1.flashcardId,
        selectedTerm: termContent,
        selectedDefinition: defContent,
      }).then(res => {
        if (res.correct) {
          setScore(res.score);

          // Update matched ref imperatively
          const newMatched = [...matchedRef.current, id1!, id2!];
          matchedRef.current = newMatched;
          setMatched(newMatched);
          setSelected([]);

          const batchSize = matchCardsRef.current.length;
          const poolSize = poolRef.current.length;

          console.log("[Match] Correct!", {
            matchedCount: newMatched.length,
            batchSize,
            poolSize,
            completed: res.completed,
          });

          // Check if current batch is fully matched
          if (newMatched.length >= batchSize) {
            if (poolSize === 0) {
              // All done — show result
              console.log("[Match] All batches done → showing result");
              setTimeout(() => setScreen("result"), 500);
            } else {
              // Load next batch
              console.log("[Match] Loading next batch...");
              setTimeout(() => {
                const nextBatch = poolRef.current.slice(0, MAX_PAIRS);
                poolRef.current = poolRef.current.slice(MAX_PAIRS);
                const newCards = buildCardsFromBatch(nextBatch);
                matchCardsRef.current = newCards;
                matchedRef.current = [];
                setMatchCards(newCards);
                setMatched([]);
                setSelected([]);
              }, 500);
            }
          }
        } else {
          setMismatched([id1!, id2!]);
          setSelected([]);
          setTimeout(() => {
            setMismatched([]);
          }, 500);
        }
      }).catch(err => {
        console.error(err);
        setSelected([]);
      });
    }
  }, [selected, matchCards, sessionData]);

  const handleSelect = (id: string) => {
    if (mismatched.length > 0 || matched.includes(id) || selected.length >= 2) return;
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      return [...s, id];
    });
  };

  const handleStart = () => {
    setIsLoading(true);
    matchApi.start(studySetId).then(res => {
      setSessionData(res);
      setScore(0);
      const shuffled = shuffle(res.responses);
      const currentBatch = shuffled.slice(0, MAX_PAIRS);
      const remaining = shuffled.slice(MAX_PAIRS);
      poolRef.current = remaining;
      const newCards = buildCardsFromBatch(currentBatch);
      matchCardsRef.current = newCards;
      matchedRef.current = [];
      setMatchCards(newCards);

      console.log("[Match] Started!", { totalPairs: res.totalPairs, batchSize: newCards.length, poolSize: remaining.length });

      resetTimer();
      setMatched([]);
      setSelected([]);
      setMismatched([]);
      setScreen("play");
    }).catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  };

  const handleReset = () => {
    resetTimer();
    poolRef.current = [];
    matchCardsRef.current = [];
    matchedRef.current = [];
    setMatched([]);
    setSelected([]);
    setMismatched([]);
    setScreen("start");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center text-red-400">
        <XCircle size={40} />
        <p>{error}</p>
        <button onClick={loadCards} className="rounded-xl bg-card px-4 py-2 text-sm text-foreground hover:bg-muted">
          Thử lại
        </button>
      </div>
    );
  }

  if (allCards.length < 2) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
        <Puzzle size={40} />
        <p>Cần ít nhất 2 thẻ để chơi ghép thẻ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer bar (only in play) */}
      <AnimatePresence>
        {screen === "play" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between rounded-2xl bg-card px-5 py-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              <Clock size={16} />
              {formatTime(elapsed)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-emerald-400 font-bold">{score} điểm</span>
            </div>
            <button
              onClick={handleReset}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw size={13} /> Làm lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screens */}
      {screen === "start" && (
        <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StartScreen total={allCards.length} onStart={handleStart} />
        </motion.div>
      )}

      {screen === "play" && (
        <div className="grid grid-cols-3 gap-3">
          {matchCards.map((card) => (
            <MemCard
              key={card.id}
              card={card}
              isSelected={selected.includes(card.id)}
              isMatched={matched.includes(card.id)}
              isMismatched={mismatched.includes(card.id)}
              onClick={() => handleSelect(card.id)}
            />
          ))}
        </div>
      )}

      {screen === "result" && (
        <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <EndScreen elapsed={elapsed} score={score} onReset={handleReset} studySetId={studySetId} />
        </motion.div>
      )}
    </div>
  );
}
