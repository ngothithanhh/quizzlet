import type { RouterOutputs } from "@acme/api";

import StudySetCard from "../shared/study-set-card";

interface OtherStudySetsProps {
  studySets: RouterOutputs["studySet"]["other"];
}

const OtherStudySets = ({ studySets }: OtherStudySetsProps) => {
  return (
    <div>
      <span className="mb-5 block text-lg font-bold">
        Other sets by this creator
      </span>
      <div className="grid gap-4 md:grid-cols-2">
        {studySets.map((set) => (
          <StudySetCard 
            key={set.id} 
            studySet={{
              id: Number(set.id),
              title: set.title,
              username: set.user.name ?? "User",
              totalFlashcards: set.flashcardCount,
              description: "",
              isPublic: true,
              favoriteCount: 0
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default OtherStudySets;
