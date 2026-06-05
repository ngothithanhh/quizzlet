"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  PlusCircle,
  Loader2,
  BookOpen,
} from "lucide-react";

import type { ClassroomResponse } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";
import { useMyClassrooms, useCreateClassroom, useJoinClassroom } from "~/hooks/use-classrooms";

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 h-4 w-2/3 rounded bg-muted" />
      <div className="mb-2 h-3 w-1/2 rounded bg-muted" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-10 rounded bg-muted" />
      </div>
    </div>
  );
}

// ── Classroom card ────────────────────────────────────────────────────────────

interface CardProps {
  classroom: ClassroomResponse;
}

function ClassroomCard({ classroom }: CardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Main link overlay */}
      <Link
        href={`/classrooms/${classroom.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={classroom.name}
      />

      <div className="relative z-10">
        {/* Title */}
        <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">
          {classroom.name}
        </h3>

        {/* Description */}
        {classroom.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {classroom.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {classroom.memberCount} thành viên
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {classroom.studySetCount} học phần
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Bởi @{classroom.ownerName}</span>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
          {classroom.currentUserRole === "OWNER" ? "Chủ sở hữu" : "Thành viên"}
        </span>
      </div>
    </div>
  );
}

// ── Create Classroom Modal ──────────────────────────────────────────────────

function CreateClassroomModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createClassroom, isPending } = useCreateClassroom();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createClassroom(
      { name, description },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          setName("");
          setDescription("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Tạo lớp học mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Tên lớp học</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ví dụ: Tiếng Anh 101"
              required
              disabled={isPending}
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Mô tả (tuỳ chọn)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
              placeholder="Mô tả về lớp học của bạn..."
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted"
              disabled={isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
              disabled={isPending || !name.trim()}
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Tạo lớp học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Join Classroom Modal ──────────────────────────────────────────────────

function JoinClassroomModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [classCode, setClassCode] = useState("");
  const { mutate: joinClassroom, isPending } = useJoinClassroom();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;

    joinClassroom(classCode.trim(), {
      onSuccess: () => {
        onSuccess();
        onClose();
        setClassCode("");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Tham gia lớp học</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Mã lớp học</label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mã lớp học (VD: ABCDEF)"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted"
              disabled={isPending}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
              disabled={isPending || !classCode.trim()}
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Tham gia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyClassrooms() {
  const { isLoggedIn, user } = useAuth();
  const { data: classrooms, isLoading, error, refetch } = useMyClassrooms();
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const filtered = classrooms.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users size={56} className="mb-4 text-primary/40" />
        <h2 className="mb-2 text-xl font-bold">Bạn chưa đăng nhập</h2>
        <p className="text-muted-foreground">
          Vui lòng đăng nhập để xem lớp học của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lớp học của tôi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tham gia hoặc tạo lớp học để chia sẻ học phần 🎓
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary/80"
          >
            Tham gia bằng mã
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
          >
            <PlusCircle size={16} />
            Tạo lớp học mới
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Tìm kiếm lớp học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Lỗi: {error}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={56} className="mb-4 text-primary/30" />
          {search ? (
            <>
              <h2 className="mb-1 text-lg font-semibold">
                Không tìm thấy lớp học
              </h2>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi từ khoá tìm kiếm.
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-1 text-lg font-semibold">
                Bạn chưa tham gia lớp học nào
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Tạo lớp học để học cùng bạn bè!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
              >
                <PlusCircle size={16} />
                Tạo ngay
              </button>
            </>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </div>
      )}

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <JoinClassroomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
