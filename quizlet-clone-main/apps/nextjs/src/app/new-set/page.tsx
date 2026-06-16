import type { Metadata } from "next";

import StudySetFormSB from "~/components/study-set/study-set-form-sb";

export const metadata: Metadata = {
  title: "Tạo học phần - Quizzlet",
  description: "Tạo học phần mới với các thẻ học của bạn",
};

export default function CreateSetPage() {
  return (
    <div className="container">
      <StudySetFormSB />
    </div>
  );
}
