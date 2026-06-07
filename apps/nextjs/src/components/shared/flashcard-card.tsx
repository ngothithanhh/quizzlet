"use client";

import { Star, Volume2 } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { useAuth } from "~/contexts/auth-context";
import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import useStar from "~/hooks/use-star";
import EditFlashcardDialog from "./edit-flashcard-dialog";

interface FlashcardCardProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][number];
  editable?: boolean;
}

const FlashcardCard = ({
  flashcard,
  editable,
}: FlashcardCardProps) => {
  const { term, definition } = flashcard;
  const { toggleStar } = useStar(flashcard);
  const { onOpenChange } = useSignInDialogContext();
  const { isLoggedIn } = useAuth();

  const fData = flashcard as any;
  const mediaList = fData.mediaList || [];
  const termImage = mediaList.find((m: any) => m.side === "TERM" && m.type === "IMAGE");
  const termAudio = mediaList.find((m: any) => m.side === "TERM" && m.type === "AUDIO");
  const defImage = mediaList.find((m: any) => m.side === "DEFINITION" && m.type === "IMAGE");
  const defAudio = mediaList.find((m: any) => m.side === "DEFINITION" && m.type === "AUDIO");

  const playAudio = (url: string) => {
    new Audio(url).play().catch(console.error);
  };

  const onStarClick = () => {
    if (isLoggedIn) {
      toggleStar();
    } else {
      onOpenChange(true);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row">
        <div className="order-2 flex h-6 items-center justify-end gap-1">
          {editable && <EditFlashcardDialog flashcard={flashcard} />}
          <Button
            onClick={onStarClick}
            size="icon"
            variant="ghost"
            className="rounded-full"
          >
            <Star
              className={flashcard.starred ? "text-yellow-300" : undefined}
              size={16}
            />
          </Button>
        </div>
        <div className="sm:flex-1">
          <div className="flex items-start justify-between">
            <div className="whitespace-pre-line">{term}</div>
            {termAudio && (
              <button onClick={() => playAudio(termAudio.url)} className="ml-2 text-muted-foreground hover:text-foreground">
                <Volume2 size={16} />
              </button>
            )}
          </div>
          {termImage && (
            <img src={termImage.url} alt="Term" className="mt-2 max-h-20 rounded-md object-contain" />
          )}
        </div>
        <Separator className="my-2 sm:hidden" />
        <div className="mx-4 hidden sm:block">
          <Separator orientation="vertical" />
        </div>
        <div className="sm:flex-1">
          <div className="flex items-start justify-between">
            <div className="whitespace-pre-line">{definition}</div>
            {defAudio && (
              <button onClick={() => playAudio(defAudio.url)} className="ml-2 text-muted-foreground hover:text-foreground">
                <Volume2 size={16} />
              </button>
            )}
          </div>
          {defImage && (
            <img src={defImage.url} alt="Definition" className="mt-2 max-h-20 rounded-md object-contain" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardCard;
