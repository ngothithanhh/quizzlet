"use client";

import Empty from "@acme/ui/empty";
import { Loader2 } from "lucide-react";

import { useLatestStudySets } from "~/hooks/use-study-sets";
import StudySetCard from "../shared/study-set-card";

const LatestStudySetsGrid = () => {
  const { data: studySets, isLoading, error } = useLatestStudySets();

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  if (error || !studySets || studySets.length === 0) {
    return <Empty message="No study sets yet." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {studySets.slice(0, 8).map((set) => (
        <StudySetCard key={set.id} studySet={set} />
      ))}
    </div>
  );
};

const LatestStudySets = () => {
  return (
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-bold">Học phần mới nhất</h2>
      <LatestStudySetsGrid />
    </div>
  );
};

export default LatestStudySets;
