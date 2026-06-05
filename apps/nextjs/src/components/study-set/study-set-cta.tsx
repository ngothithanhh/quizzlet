"use client";

import Link from "next/link";
import { Edit } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import { useAuth } from "~/contexts/auth-context";
import StudySetFoldersDialog from "./study-set-folders-dialog";
import StudySetOptionsDropdown from "./study-set-options-dropdown";
import StudySetShareDialog from "./study-set-share-dialog";

interface StudySetCTAProps {
  id: string;
  userId: string;
}

const StudySetCTA = ({ id, userId }: StudySetCTAProps) => {
  const { user, isLoggedIn } = useAuth();
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex gap-2">
        {isLoggedIn && <StudySetFoldersDialog />}
        {user?.email === userId && (
          <Tooltip>
            <Link href={`/study-sets/${id}/edit`}>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Edit size={16} />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
            </Link>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        )}
        <StudySetShareDialog id={id} />
        <StudySetOptionsDropdown
          id={id}
          isOwner={user?.email === userId}
          userId={user?.email}
        />
      </div>
    </TooltipProvider>
  );
};

export default StudySetCTA;
