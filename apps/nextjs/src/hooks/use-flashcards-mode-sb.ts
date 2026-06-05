"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAnimate } from "framer-motion";

import type { FlashcardResponse } from "~/lib/api-client";
import { flashcardApi } from "~/lib/api-client";
import { useStudySet } from "~/hooks/use-study-sets";
import { useFlashcardsModeReducer } from "./use-flashcards-mode-reducer";
import { useState } from "react";

export function useFlashcardsModeSB(studySetIdStr: string) {
  const numericId = Number(studySetIdStr);
  const { data: studySet, isLoading, error, refetch } = useStudySet(
    isNaN(numericId) ? null : numericId,
  );

  const initialFlashcards: FlashcardResponse[] = studySet?.flashcards ?? [];

  const [{ sorting, flashcards, index, hard, know }, dispatch] =
    useFlashcardsModeReducer(initialFlashcards);

  const [cardRef, animateCard] = useAnimate();
  const [messageRef, animateMessage] = useAnimate();

  // Keep flashcards in sync when studySet data arrives
  const prevFlashcardsRef = useRef<FlashcardResponse[]>([]);
  useEffect(() => {
    if (!studySet) return;
    const prev = prevFlashcardsRef.current;
    const next = studySet.flashcards;
    if (prev.length !== next.length || prev[0]?.id !== next[0]?.id) {
      dispatch({ type: "SET_FLASHCARDS", payload: next });
      prevFlashcardsRef.current = next;
    }
  }, [studySet, dispatch]);

  const currentCard = flashcards[index];
  const count = flashcards.length;
  const progress = count > 0 ? (index / count) * 100 : 0;

  const reviewHard = useCallback(() => {
    dispatch({ type: "REVIEW_HARD" });
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET", payload: studySet?.flashcards ?? [] });
  }, [dispatch, studySet]);

  const handleLeft = useCallback(async () => {
    if (!currentCard) return;

    if (sorting) {
      dispatch({ type: "MARK_HARD", payload: currentCard });
      await animateMessage(
        messageRef.current,
        {
          opacity: [0, 1, 1, 0],
          visibility: "visible",
          rotate: [0, 2, 2, 0],
          translateX: [0, 0, 0, -50],
        },
        { ease: "linear", duration: 0.5 },
      );
      await animateMessage(
        messageRef.current,
        { visibility: "hidden" },
        { duration: 0 },
      );
      dispatch({ type: "NEXT" });
    } else {
      dispatch({ type: "PREVIOUS" });
      void animateCard(
        cardRef.current,
        { rotateY: [15, 0], translateX: [-60, 0] },
        { duration: 0.15 },
      );
    }
  }, [currentCard, sorting, dispatch, animateCard, animateMessage, cardRef, messageRef]);

  const handleRight = useCallback(async () => {
    if (!currentCard) return;

    if (sorting) {
      dispatch({ type: "MARK_KNOWN" });
      await animateMessage(
        messageRef.current,
        {
          opacity: [0, 1, 1, 0],
          visibility: "visible",
          rotate: [0, -2, -2, 0],
          translateX: [0, 0, 0, 50],
        },
        { ease: "linear", duration: 0.5 },
      );
      await animateMessage(
        messageRef.current,
        { visibility: "hidden" },
        { duration: 0 },
      );
    } else {
      void animateCard(
        cardRef.current,
        { translateX: [60, 0], rotateY: [-15, 0] },
        { duration: 0.15 },
      );
    }
    dispatch({ type: "NEXT" });
  }, [currentCard, sorting, dispatch, animateCard, animateMessage, cardRef, messageRef]);

  const shuffle = useCallback(() => {
    dispatch({ type: "SHUFFLE" });
  }, [dispatch]);

  const toggleSorting = useCallback(() => {
    dispatch({ type: "TOGGLE_SORTING" });
  }, [dispatch]);

  return {
    index,
    currentCard,
    sorting,
    starredOnly: false,
    disableStarredOnly: true,
    count,
    hardCount: hard.length,
    cardRef,
    messageRef,
    know,
    progress,
    handleLeft,
    handleRight,
    reset,
    reviewHard,
    shuffle,
    toggleSorting,
    toggleStarredOnly: () => undefined,
    isLoading,
    error,
    studySet,
    refetch,
  };
}
