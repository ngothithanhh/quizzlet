"use client";

import { useCallback, useState } from "react";
import { ttsApi } from "~/lib/api-client";

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playText = useCallback(async (text: string, languageCode: string = "auto", voiceName?: string) => {
    if (!text.trim()) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setIsSynthesizing(true);
    try {
      const response = await ttsApi.synthesize({ text, languageCode, voiceName });
      if (response.audioUrl) {
        const audio = new Audio(response.audioUrl);
        setCurrentAudio(audio);
        setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
        };
        await audio.play();
      }
    } catch (error) {
      console.error("Failed to synthesize speech:", error);
      setIsPlaying(false);
    } finally {
      setIsSynthesizing(false);
    }
  }, [currentAudio]);

  const stop = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentAudio]);

  return { playText, stop, isPlaying, isSynthesizing };
}
