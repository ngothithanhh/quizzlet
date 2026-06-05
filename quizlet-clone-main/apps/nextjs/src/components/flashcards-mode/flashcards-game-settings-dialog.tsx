"use client";

import { Settings } from "lucide-react";
import { useState } from "react";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";

const FlashcardsGameSettingsDialog = () => {
  const { sorting, reset, toggleSorting } = useFlashcardsModeContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Cài đặt"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Settings size={18} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl">
            <h3 className="mb-4 text-sm font-bold">Cài đặt học thẻ</h3>

            {/* Sorting mode */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Phân loại thẻ</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Chia thẻ thành "Biết rồi" và "Chưa biết"
                </p>
              </div>
              <button
                onClick={toggleSorting}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                  sorting ? "bg-violet-600" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    sorting ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <button
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="w-full rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20"
              >
                🔄 Bắt đầu lại từ đầu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardsGameSettingsDialog;
