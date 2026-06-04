"use client";

import type { FlashcardResponse } from "~/lib/api-client";
import { cn } from "@acme/ui";

interface FlipCardContentProps {
  flashcard: FlashcardResponse;
  back?: boolean;
}

const FlipCardContent = ({ flashcard, back }: FlipCardContentProps) => {
  const label = back ? "Định nghĩa" : "Thuật ngữ";
  const content = back ? flashcard.definition : flashcard.term;

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full [backface-visibility:hidden]",
        back && "[transform:rotateX(180deg)]",
      )}
    >
      <div
        className={cn(
          "flex h-full w-full flex-col rounded-2xl p-6 shadow-xl",
          back
            ? "bg-gradient-to-br from-violet-600/90 to-indigo-700/90 text-primary-foreground"
            : "bg-card border border-border text-foreground",
        )}
      >
        {/* Label badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
              back
                ? "bg-muted text-foreground/90"
                : "bg-card text-muted-foreground",
            )}
          >
            {label}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center px-4">
          <p
            className={cn(
              "select-none text-center font-bold leading-relaxed",
              content.length > 100
                ? "text-xl"
                : content.length > 50
                  ? "text-2xl"
                  : "text-3xl",
            )}
          >
            {content}
          </p>
        </div>

        {/* Hint */}
        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            {back ? "Nhấp để xem thuật ngữ" : "Nhấp để xem định nghĩa"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipCardContent;
