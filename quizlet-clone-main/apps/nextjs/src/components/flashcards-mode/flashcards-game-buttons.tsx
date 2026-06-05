"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Maximize,
  Shuffle,
  X,
  Settings,
} from "lucide-react";

import { cn } from "@acme/ui";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";
import FlashcardsGameSettingsDialog from "./flashcards-game-settings-dialog";

interface FlashcardButtonsProps {
  fullscreen?: boolean;
}

const FlashcardsGameButtons = ({ fullscreen }: FlashcardButtonsProps) => {
  const { id }: { id: string } = useParams();
  const { shuffle, handleLeft, handleRight, index, sorting, count } =
    useFlashcardsModeContext();

  return (
    <div className="relative flex items-center justify-between gap-3 rounded-xl bg-card/60 px-4 py-3 shadow-sm backdrop-blur-sm">
      {/* Left: Shuffle */}
      <button
        onClick={shuffle}
        title="Xáo trộn thẻ"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Shuffle size={18} />
      </button>

      {/* Center: Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => void handleLeft()}
          disabled={!sorting && index === 0}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold transition",
            sorting
              ? "border-red-500/40 text-red-500 hover:border-red-500 hover:bg-red-500/10"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30",
          )}
          title={sorting ? "Chưa biết" : "Thẻ trước"}
        >
          {sorting ? <X size={20} /> : <ArrowLeft size={20} />}
        </button>

        <span className="min-w-[3rem] text-center text-sm font-semibold tabular-nums text-muted-foreground">
          {index + 1} / {count}
        </span>

        <button
          onClick={() => void handleRight()}
          disabled={index >= count}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border-2 font-bold transition",
            sorting
              ? "border-green-500/40 text-green-500 hover:border-green-500 hover:bg-green-500/10"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30",
          )}
          title={sorting ? "Biết rồi" : "Thẻ tiếp"}
        >
          {sorting ? <Check size={20} /> : <ArrowRight size={20} />}
        </button>
      </div>

      {/* Right: Settings + Fullscreen */}
      <div className="flex items-center gap-1">
        <FlashcardsGameSettingsDialog />

        {!fullscreen && (
          <Link
            href={`/study-sets/${id}/flashcards`}
            title="Toàn màn hình"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Maximize size={18} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default FlashcardsGameButtons;
