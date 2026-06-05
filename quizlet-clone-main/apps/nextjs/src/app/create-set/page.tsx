import type { Metadata } from "next";

import StudySetFormSB from "~/components/study-set/study-set-form-sb";

export const metadata: Metadata = {
  title: "Create study set",
};

export default function CreateSet() {
  return <StudySetFormSB />;
}
