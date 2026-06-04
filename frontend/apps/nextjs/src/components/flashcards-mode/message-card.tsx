"use client";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";

const MessageCard = () => {
  const { messageRef, know } = useFlashcardsModeContext();

  return (
    <div
      ref={messageRef}
      className="invisible absolute inset-0 z-30 flex items-center justify-center rounded-2xl opacity-0"
      style={{
        background: know
          ? "rgba(34, 197, 94, 0.15)"
          : "rgba(239, 68, 68, 0.15)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className={`rounded-2xl px-8 py-4 text-4xl font-black shadow-lg ${
          know
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {know ? "✓ Biết rồi!" : "✗ Chưa biết"}
      </div>
    </div>
  );
};

export default MessageCard;
