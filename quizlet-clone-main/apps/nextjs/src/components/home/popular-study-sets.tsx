"use client";

import Empty from "@acme/ui/empty";
import { Loader2 } from "lucide-react";

import { useAllStudySets } from "~/hooks/use-study-sets";
import StudySetCard from "../shared/study-set-card";

const PopularStudySetsGrid = () => {
  const { data: studySets, isLoading, error } = useAllStudySets();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  if (error || !studySets || studySets.length === 0) {
    return <Empty message="No popular study sets yet." />;
  }

  // Use the same getAll but perhaps sort by favoriteCount or just slice differently to differentiate for now
  const popularSets = [...studySets].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 4);

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {popularSets.map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </div>
  );
};

const PopularStudySets = () => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Popular study sets</h2>
      <PopularStudySetsGrid />
    </div>
  );
};

export default PopularStudySets;
