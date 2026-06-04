import type { Metadata } from "next";

import StudySetForm from "~/components/study-set/study-set-form";

export const metadata: Metadata = {
  title: "Create study set",
};

export default function CreateSet() {
  return <StudySetForm />;
}
