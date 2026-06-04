"use client";

import AssignmentTestMode from "~/components/test-mode/assignment-test-mode";

export default function AssignmentTestPage({ params }: { params: { id: string } }) {
  const assignmentId = parseInt(params.id, 10);

  if (isNaN(assignmentId)) {
    return <div className="p-8 text-center text-muted-foreground">ID bài tập không hợp lệ</div>;
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <AssignmentTestMode assignmentId={assignmentId} />
    </main>
  );
}
