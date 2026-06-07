"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  BookOpen,
  Clock,
  Edit3,
  LayoutGrid,
  Settings,
  Trophy,
  User,
} from "lucide-react";

import { useAuth } from "~/contexts/auth-context";
import { useMyStudySets } from "~/hooks/use-study-sets";
import { useTestHistory, useLearnHistory, useMatchHistory } from "~/hooks/use-history";
import { useMyProfile } from "~/hooks/use-user";
import ChangePasswordForm from "~/components/profile/change-password-form";
import UpdateProfileForm from "~/components/profile/update-profile-form";

type Tab = "overview" | "sets" | "history" | "settings";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-4 shadow-sm text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user } = useAuth();
  const { data: profile } = useMyProfile();

  const { data: mySets, isLoading: isSetsLoading } = useMyStudySets();
  const { data: testHistory } = useTestHistory();
  const { data: matchHistory } = useMatchHistory();
  const { data: learnHistory } = useLearnHistory();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Bạn cần đăng nhập để xem trang cá nhân.</p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  const username = profile?.username ?? user.username ?? user.email;
  const initials = username.charAt(0).toUpperCase();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Tổng quan", icon: <User size={16} /> },
    { key: "sets", label: "Học phần", icon: <LayoutGrid size={16} /> },
    { key: "history", label: "Lịch sử", icon: <Clock size={16} /> },
    { key: "settings", label: "Cài đặt", icon: <Settings size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* ── Profile Hero ────────────────────────────────── */}
      <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:gap-6">
        {/* Avatar */}
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full object-cover shadow-md"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-3xl font-bold text-white shadow-md">
            {initials}
          </div>
        )}
        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">
            {username}
          </h1>
          <p className="text-sm text-muted-foreground">{profile?.email ?? user.email}</p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{mySets?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Học phần</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{testHistory?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Bài test</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{matchHistory?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Ghép thẻ</p>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────── */}
      <div className="mb-6 flex gap-1 rounded-xl border bg-card p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === t.key
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────── */}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<BookOpen size={20} />}
              label="Học phần đã tạo"
              value={mySets?.length ?? 0}
            />
            <StatCard
              icon={<Trophy size={20} />}
              label="Bài kiểm tra"
              value={testHistory?.length ?? 0}
            />
            <StatCard
              icon={<LayoutGrid size={20} />}
              label="Phiên ghép thẻ"
              value={matchHistory?.length ?? 0}
            />
            <StatCard
              icon={<Clock size={20} />}
              label="Lần học thẻ"
              value={learnHistory?.length ?? 0}
            />
          </div>

          {/* Recent test results */}
          {testHistory && testHistory.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-foreground">Kết quả kiểm tra gần đây</h2>
              <div className="space-y-2">
                {testHistory.slice(0, 3).map((item) => (
                  <div
                    key={item.attemptId}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.studySetTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.submittedAt), "dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        item.score >= 80
                          ? "text-emerald-500"
                          : item.score >= 50
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Study Sets */}
      {activeTab === "sets" && (
        <div>
          {isSetsLoading ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : !mySets || mySets.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
              <BookOpen size={40} className="opacity-20" />
              <p>Bạn chưa có học phần nào.</p>
              <Link
                href="/study-sets/create"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Tạo học phần mới
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {mySets.map((set) => (
                <div
                  key={set.id}
                  className="group relative rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
                >
                  <Link href={`/study-sets/${set.id}`} className="block">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition">
                      {set.title}
                    </h3>
                    {set.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {set.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {set.totalFlashcards} thẻ
                      </span>
                      <span>{set.isPublic ? "Công khai" : "Riêng tư"}</span>
                    </div>
                  </Link>
                  {/* Edit link */}
                  <Link
                    href={`/study-sets/${set.id}/edit`}
                    className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  >
                    <Edit3 size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Bài Kiểm Tra</h2>
            {!testHistory || testHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có lịch sử kiểm tra.</p>
            ) : (
              <div className="space-y-2">
                {testHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.attemptId}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.studySetTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.submittedAt), "HH:mm - dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-violet-600">{item.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Ghép Thẻ</h2>
            {!matchHistory || matchHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có lịch sử ghép thẻ.</p>
            ) : (
              <div className="space-y-2">
                {matchHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.sessionId}
                    className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.studySetTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.completedAt), "HH:mm - dd/MM/yyyy", { locale: vi })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-600">{item.score} điểm</p>
                      <p className="text-xs text-muted-foreground">{(item.timeMs / 1000).toFixed(1)}s</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/history"
            className="block text-center text-sm font-medium text-primary hover:underline"
          >
            Xem toàn bộ lịch sử →
          </Link>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="max-w-lg">
          <UpdateProfileForm />
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}
