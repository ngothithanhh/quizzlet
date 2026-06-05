import type { Metadata } from "next";

import HistoryView from "~/components/history/history-view";

export const metadata: Metadata = {
  title: "Lịch sử - Quizzlet",
  description: "Lịch sử hoạt động của bạn",
};

export default function HistoryPage() {
  return <HistoryView />;
}
