import Link from "next/link";

import type { StudySetSimpleResponse } from "~/lib/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { Card, CardContent } from "@acme/ui/card";

const StudySetCard = ({
  studySet,
}: {
  studySet: StudySetSimpleResponse;
}) => {
  const { id, title, totalFlashcards, username } = studySet;

  return (
    <Card className="relative cursor-pointer hover:shadow-md">
      <Link
        href={`/study-sets/${id}`}
        className="absolute left-0 top-0 h-full w-full"
      ></Link>
      <CardContent className="p-5">
        <span className="mb-2">{title}</span>
        <Badge className="mt-2 block w-fit">Terms {totalFlashcards}</Badge>
        <div className="relative z-10 mt-8 inline-flex items-center">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarFallback className="text-sm">
              {username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button variant="link" className="p-0 text-foreground">
            {username}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySetCard;
