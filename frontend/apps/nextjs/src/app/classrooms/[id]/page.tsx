import { Metadata } from "next";

import ClassroomDetail from "~/components/classroom/classroom-detail";

export const metadata: Metadata = {
  title: "Chi tiết lớp học - Quizlet Clone",
  description: "Thông tin lớp học",
};

export default function ClassroomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClassroomDetail classId={Number(params.id)} />;
}
