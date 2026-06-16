import type { Metadata } from "next";

import MyStudySets from "~/components/study-set/my-study-sets";

export const metadata: Metadata = {
  title: "Học phần của tôi - Quizzlet",
  description: "Quản lý toàn bộ học phần của bạn",
};

export default function MyStudySetsPage() {
  return <MyStudySets />;
}
