import React from "react";
import Link from "next/link";
import { Folder } from "lucide-react";

import type { FolderSimpleResponse } from "~/lib/api-client";
import { Badge } from "@acme/ui/badge";
import { Card, CardContent } from "@acme/ui/card";

const FolderCard = ({
  folder,
}: {
  folder: FolderSimpleResponse;
}) => {
  const { name, userId, id } = folder;

  return (
    <Link href={`/users/${userId}/folders/${id}`}>
      <Card className="transition duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Folder size={24} />
            <span>{name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FolderCard;
