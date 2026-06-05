import type { Metadata } from "next";

import MyClassrooms from "~/components/classroom/my-classrooms";

export const metadata: Metadata = {
  title: "Lớp học của tôi - Quizlet Clone",
  description: "Quản lý toàn bộ lớp học của bạn",
};

export default function MyClassroomsPage() {
  return <MyClassrooms />;
}
