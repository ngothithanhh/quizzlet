"use client";

import { useParams, useRouter } from "next/navigation";
import { GraduationCap, RotateCcw, Undo2 } from "lucide-react";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";
import FlashcardsGameButtons from "./flashcards-game-buttons";
import FlipCard from "./flip-card";
import MessageCard from "./message-card";

interface FlashcardsGameProps {
  fullscreen?: boolean;
}

// Skeleton loader for the card area
function CardSkeleton({ fullscreen }: { fullscreen?: boolean }) {
  return (
    <div className="w-full">
      <div
        className={`w-full animate-pulse rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 ${
          fullscreen ? "min-h-[42rem]" : "min-h-[22rem] sm:min-h-[26rem]"
        }`}
      />
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}

// Empty / finished state
function GameResult({
  hardCount,
  count,
  fullscreen,
  reviewHard,
  reset,
}: {
  hardCount: number;
  count: number;
  fullscreen?: boolean;
  reviewHard: () => void;
  reset: () => void;
}) {
  const router = useRouter();
  const { id }: { id: string } = useParams();

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold">
        {hardCount > 0
          ? `Bạn đang học ${hardCount} thuật ngữ khó`
          : "Bạn đã hoàn thành tất cả thẻ!"}
      </h2>
      <p className="text-muted-foreground">
        {hardCount > 0
          ? `Ôn lại ${hardCount} thẻ bạn chưa thuộc trong số ${count} thẻ.`
          : `Bạn đã học qua tất cả ${count} thẻ.`}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {hardCount > 0 && (
          <button
            onClick={reviewHard}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-primary-foreground shadow-lg transition hover:bg-amber-600"
          >
            <GraduationCap size={20} />
            Ôn lại thẻ khó ({hardCount})
          </button>
        )}
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold transition hover:bg-muted"
        >
          <RotateCcw size={20} />
          Học lại từ đầu
        </button>
        {fullscreen && (
          <button
            onClick={() => router.push(`/study-sets/${id}`)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold transition hover:bg-muted"
          >
            <Undo2 size={20} />
            Quay lại học phần
          </button>
        )}
      </div>
    </div>
  );
}

const FlashcardsGame = ({ fullscreen }: FlashcardsGameProps) => {
  const {
    currentCard,
    count,
    hardCount,
    sorting,
    reset,
    reviewHard,
    progress,
    isLoading,
    error,
  } = useFlashcardsModeContext();

  if (isLoading) {
    return <CardSkeleton fullscreen={fullscreen} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">Không thể tải dữ liệu</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">Học phần này chưa có thẻ nào</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <GameResult
        hardCount={hardCount}
        count={count}
        fullscreen={fullscreen}
        reviewHard={reviewHard}
        reset={reset}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex [perspective:1200px]">
        {sorting && <MessageCard />}
        <FlipCard fullscreen={fullscreen} />
      </div>

      <FlashcardsGameButtons fullscreen={fullscreen} />

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% hoàn thành</span>
          <span>{count} thẻ</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FlashcardsGame;
