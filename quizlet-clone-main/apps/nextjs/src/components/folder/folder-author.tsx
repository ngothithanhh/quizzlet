"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";

import { useFolderDetail } from "~/hooks/use-folders";

const FolderAuthor = () => {
  const { slug }: { slug: string } = useParams();
  const folderId = Number(slug);
  const { data: folder, isLoading } = useFolderDetail(folderId);

  if (isLoading || !folder) return null;

  return (
    <div className="flex items-center gap-6">
      <span className="text-sm">{folder.studySets.length} sets</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">created by</span>
        <Link href={`/users/${folder.userId}`} className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <User size={16} />
            </AvatarFallback>
          </Avatar>
          <Button className="p-0 text-foreground" variant="link">
            {folder.userName}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FolderAuthor;
