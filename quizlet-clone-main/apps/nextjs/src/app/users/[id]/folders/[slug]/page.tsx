"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@acme/ui/button";

import FolderAuthor from "~/components/folder/folder-author";
import FolderCTA from "~/components/folder/folder-cta";
import FolderInfo from "~/components/folder/folder-info";
import FolderStudySets from "~/components/folder/folder-study-sets";

export default function Folder() {
  const params = useParams<{ slug: string; id: string }>();
  const slug = params.slug;
  const id = params.id;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <FolderAuthor />
        <FolderCTA slug={slug} />
      </div>
      <FolderInfo />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Học phần trong thư mục</h2>
        <Link href={`/users/${id}/folders/${slug}/learn`}>
          <Button variant="primary" className="gap-2">
            <GraduationCap size={18} />
            Học thư mục
          </Button>
        </Link>
      </div>
      <FolderStudySets />
    </div>
  );
}
