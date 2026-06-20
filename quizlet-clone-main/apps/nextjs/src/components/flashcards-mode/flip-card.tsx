"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

import { cn } from "@acme/ui";

import { useFlashcardsModeContext } from "~/contexts/flashcards-mode-context";
import FlipCardContent from "./flip-card-content";

interface FlipCardProps {
  fullscreen?: boolean;
}

const SWIPE_THRESHOLD = 80;

const FlipCard = ({ fullscreen }: FlipCardProps) => {
  const { currentCard, cardRef, handleLeft, handleRight, sorting, index } =
    useFlashcardsModeContext();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-200, 0, 200], [-12, 0, 12]);

  // Overlay opacities for left/right swipe feedback
  const leftOpacity = useTransform(dragX, [-120, -20], [1, 0]);
  const rightOpacity = useTransform(dragX, [20, 120], [0, 1]);

  if (!currentCard) return null;

  const handleDragEnd = async (_: unknown, info: { offset: { x: number } }) => {
    const offset = info.offset.x;
    if (offset < -SWIPE_THRESHOLD) {
      // Swipe left - always MARK_HARD
      await animate(cardRef.current, { x: -window.innerWidth }, { duration: 0.25 });
      await animate(cardRef.current, { x: 0 }, { duration: 0 });
      setIsFlipped(false);
      void handleLeft(true);
    } else if (offset > SWIPE_THRESHOLD) {
      // Swipe right - always MARK_KNOWN
      await animate(cardRef.current, { x: window.innerWidth }, { duration: 0.25 });
      await animate(cardRef.current, { x: 0 }, { duration: 0 });
      setIsFlipped(false);
      void handleRight(true);
    } else {
      // Snap back
      void animate(cardRef.current, { x: 0, rotate: 0 }, { duration: 0.2, ease: "easeOut" });
    }
    dragX.set(0);
    setIsDragging(false);
  };

  return (
    <div
      className={cn("relative w-full select-none", {
        "min-h-[22rem] sm:min-h-[26rem]": !fullscreen,
        "min-h-[42rem]": fullscreen,
      })}
      style={{ perspective: 1200 }}
    >
      {/* Swipe feedback overlays */}
      <>
        <motion.div
          style={{ opacity: leftOpacity }}
          className="pointer-events-none absolute left-4 top-6 z-20 rounded-xl border-4 border-red-500 px-4 py-2 text-2xl font-black text-red-500"
        >
          ← Chưa thuộc
        </motion.div>
        <motion.div
          style={{ opacity: rightOpacity }}
          className="pointer-events-none absolute right-4 top-6 z-20 rounded-xl border-4 border-green-500 px-4 py-2 text-2xl font-black text-green-500"
        >
          Đã thuộc →
        </motion.div>
      </>

      {/* Card wrapper – draggable */}
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        style={{ x: dragX, rotate: dragRotate }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (!isDragging) setIsFlipped((f) => !f);
        }}
        className="absolute inset-0 cursor-pointer [transform-style:preserve-3d]"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <FlipCardContent flashcard={currentCard} />
        <FlipCardContent flashcard={currentCard} back />
      </motion.div>
    </div>
  );
};

export default FlipCard;
