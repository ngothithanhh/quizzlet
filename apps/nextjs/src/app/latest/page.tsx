import type { Metadata } from "next";

import LatestStudySets from "~/components/home/latest-study-sets";

export const metadata: Metadata = {
  title: "Quizzlet - Latest",
};

export default function Latest() {
  return (
    <main className="container py-8">
      <LatestStudySets />
    </main>
  );
}
