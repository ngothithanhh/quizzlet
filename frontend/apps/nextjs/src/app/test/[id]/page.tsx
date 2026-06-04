"use client";

import TestMode from "~/components/test-mode/test-mode";

export default function AssignmentTestPage({ params }: { params: { id: string } }) {
  const testId = parseInt(params.id, 10);

  if (isNaN(testId)) {
    return <div className="p-8 text-center text-muted-foreground">ID bài kiểm tra không hợp lệ</div>;
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <TestMode testId={testId} />
    </main>
  );
}
