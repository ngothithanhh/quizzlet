"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  PlusCircle,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import type { StudySetSimpleResponse } from "~/lib/api-client";
import { favoriteApi } from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";
import { useMyStudySets, useDeleteStudySet } from "~/hooks/use-study-sets";
import { FavoriteButton } from "../shared/favorite-button";
import { useQuery } from "@tanstack/react-query";
import SharedStudySetCard from "../shared/study-set-card";

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

// ── Study set card ────────────────────────────────────────────────────────────

interface CardProps {
  studySet: StudySetSimpleResponse;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

function StudySetCard({ studySet, onDelete, isDeleting }: CardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Main link overlay */}
      <Link
        href={`/study-sets/${studySet.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={studySet.title}
      />

      <div className="relative z-10">
        <FavoriteButton studySetId={studySet.id} />
        {/* Title */}
        <h3 className="mb-1 line-clamp-2 font-semibold text-foreground pr-6">
          {studySet.title}
        </h3>

        {/* Description */}
        {studySet.description && (
          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {studySet.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {studySet.totalFlashcards} thẻ
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} />
            {studySet.favoriteCount}
          </span>
          <span className="flex items-center gap-1">
            {studySet.isPublic ? (
              <>
                <Eye size={12} /> Công khai
              </>
            ) : (
              <>
                <EyeOff size={12} /> Riêng tư
              </>
            )}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">@{studySet.username}</span>

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <Link
            href={`/study-sets/${studySet.id}/edit`}
            className="rounded-md px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            Sửa
          </Link>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                className="rounded-md px-2 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(studySet.id);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  "Xác nhận"
                )}
              </button>
              <button
                className="rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmDelete(false);
                }}
              >
                Huỷ
              </button>
            </div>
          ) : (
            <button
              className="rounded-md p-1 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                setConfirmDelete(true);
              }}
              title="Xoá học phần"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyStudySets() {
  const { isLoggedIn, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"created" | "favorites">("created");
  
  // Queries
  const { data: createdSets = [], isLoading: isLoadingCreated, error: createdError, refetch: refetchCreated } = useMyStudySets();
  const { data: favoriteSets = [], isLoading: isLoadingFavorites, error: favoriteError } = useQuery({
    queryKey: ["my-favorites"],
    queryFn: async () => {
      const favs = await favoriteApi.getMyFavorites();
      return favs.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        isPublic: f.isPublic,
        favoriteCount: f.favoriteCount,
        username: f.username,
        totalFlashcards: f.flashcards?.length ?? 0,
      } as StudySetSimpleResponse));
    },
    enabled: isLoggedIn,
  });

  const { mutate: deleteSet, isPending: isDeleting } = useDeleteStudySet();
  const [search, setSearch] = useState("");

  const currentSets = activeTab === "created" ? createdSets : favoriteSets;
  const isLoading = activeTab === "created" ? isLoadingCreated : isLoadingFavorites;
  const error = activeTab === "created" ? createdError : favoriteError;

  const filtered = currentSets.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    void deleteSet(id, {
      onSuccess: () => void refetchCreated(),
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen size={56} className="mb-4 text-primary/40" />
        <h2 className="mb-2 text-xl font-bold">Bạn chưa đăng nhập</h2>
        <p className="text-muted-foreground">
          Vui lòng đăng nhập để xem học phần của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Học phần của tôi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xin chào, <span className="font-medium">{user?.username}</span> 👋
          </p>
        </div>

        <Link
          href="/create-set"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
        >
          <PlusCircle size={16} />
          Tạo học phần mới
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Tìm kiếm học phần..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 gap-8">
        <button 
          onClick={() => setActiveTab("created")} 
          className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === "created" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Đã tạo ({createdSets.length})
        </button>
        <button 
          onClick={() => setActiveTab("favorites")} 
          className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === "favorites" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Yêu thích ({favoriteSets.length})
        </button>
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
          Lỗi: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={56} className="mb-4 text-primary/30" />
          {search ? (
            <>
              <h2 className="mb-1 text-lg font-semibold">
                Không tìm thấy học phần
              </h2>
              <p className="text-sm text-muted-foreground">
                Thử thay đổi từ khoá tìm kiếm.
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-1 text-lg font-semibold">
                Bạn chưa có học phần nào
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Tạo học phần đầu tiên của bạn ngay!
              </p>
              <Link
                href="/create-set"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90"
              >
                <PlusCircle size={16} />
                Tạo ngay
              </Link>
            </>
          )}
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((studySet) => (
            activeTab === "created" ? (
              <StudySetCard
                key={studySet.id}
                studySet={studySet}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ) : (
              <SharedStudySetCard
                key={studySet.id}
                studySet={studySet}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
