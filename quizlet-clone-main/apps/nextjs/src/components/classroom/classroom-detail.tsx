"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Settings,
  Trash2,
  ChevronLeft,
  Loader2,
  Copy,
  CheckCircle2,
  PlusCircle,
  LogOut,
  UserPlus,
  FileText,
  Calendar,
  Clock,
  MoreVertical,
  Star,
} from "lucide-react";

import { useAuth } from "~/contexts/auth-context";
import {
  useClassroom,
  useUpdateClassroom,
  useDeleteClassroom,
  useAddStudySetToClassroom,
  useClassMembers,
  useClassStudySets,
  useClassAssignments,
  useLeaveClassroom,
  useAddMember,
  useRemoveMember,
  useUpdateMemberRole,
  useRemoveStudySet,
  useCreateAssignment,
  useAddFavoriteStudySetToClassroom,
} from "~/hooks/use-classrooms";
import { useMyStudySets, useFavorites } from "~/hooks/use-study-sets";
import { testApi, userApi, type UserSearchResponse } from "~/lib/api-client";
import { FavoriteButton } from "../shared/favorite-button";

interface Props {
  classId: number;
}

export default function ClassroomDetail({ classId }: Props) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { data: classroom, isLoading, error, refetch } = useClassroom(classId);

  const [activeTab, setActiveTab] = useState<"studysets" | "members" | "assignments">("studysets");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    refetch(); // Cập nhật lại thông tin tổng quan của lớp (số lượng...)
    setRefreshTrigger((prev) => prev + 1); // Cập nhật lại nội dung các tab
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudySetModalOpen, setIsAddStudySetModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    if (classroom?.inviteCode) {
      navigator.clipboard.writeText(classroom.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users size={56} className="mb-4 text-primary/40" />
        <h2 className="mb-2 text-xl font-bold">Bạn chưa đăng nhập</h2>
        <p className="text-muted-foreground">Vui lòng đăng nhập để xem lớp học.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl py-8 flex justify-center">
        <Loader2 size={32} className="animate-spin text-primary/50" />
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Lỗi: {error || "Không tìm thấy lớp học"}
        </div>
        <Link href="/classrooms" className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ChevronLeft size={16} className="mr-1" /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isOwner = classroom.currentUserRole === "OWNER";
  const isTeacher = classroom.currentUserRole === "TEACHER";
  const canManageClass = isOwner || isTeacher;

  return (
    <div className="mx-auto max-w-5xl py-8">
      <Link href="/classrooms" className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ChevronLeft size={16} className="mr-1" /> Danh sách lớp học
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{classroom.name}</h1>
            {isOwner && (
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                Chủ sở hữu
              </span>
            )}
          </div>
          <p className="mb-6 text-muted-foreground">{classroom.description || "Chưa có mô tả"}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
              <Users size={16} className="text-muted-foreground" />
              <span className="font-medium">{classroom.memberCount} thành viên</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
              <BookOpen size={16} className="text-muted-foreground" />
              <span className="font-medium">{classroom.studySetCount} học phần</span>
            </div>
          </div>
        </div>

        {canManageClass ? (
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm md:w-72">
            <h3 className="text-sm font-semibold">Mã mời tham gia</h3>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span className="font-mono text-lg font-bold tracking-wider">{classroom.inviteCode}</span>
              <button onClick={copyInviteCode} className="text-muted-foreground hover:text-foreground transition">
                {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            {isOwner && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
                >
                  <Settings size={14} /> Sửa
                </button>
                <DeleteClassroomButton classId={classId} />
              </div>
            )}
            {isTeacher && (
              <div className="mt-2 flex gap-2">
                <LeaveClassroomButton classId={classId} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:w-72 items-end">
            <LeaveClassroomButton classId={classId} />
          </div>
        )}
      </div>

      {/* TABS */}
      <div className="flex border-b border-border mb-6 gap-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("studysets")} 
          className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === "studysets" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Học phần của lớp
        </button>
        <button 
          onClick={() => setActiveTab("members")} 
          className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === "members" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Thành viên
        </button>
        <button 
          onClick={() => setActiveTab("assignments")} 
          className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === "assignments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Bài tập
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "studysets" && (
          <StudySetsTab classId={classId} canManageClass={canManageClass} onAdd={() => setIsAddStudySetModalOpen(true)} refreshTrigger={refreshTrigger} />
        )}
        {activeTab === "members" && (
          <MembersTab classId={classId} canManageClass={canManageClass} isOwner={isOwner} onAdd={() => setIsAddMemberModalOpen(true)} currentUserId={user?.id ? Number(user.id) : undefined} refreshTrigger={refreshTrigger} />
        )}
        {activeTab === "assignments" && (
          <AssignmentsTab classId={classId} canManageClass={canManageClass} onAdd={() => setIsCreateAssignmentModalOpen(true)} refreshTrigger={refreshTrigger} />
        )}
      </div>

      <EditClassroomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        classroom={classroom}
        onSuccess={handleSuccess}
      />

      <AddStudySetModal
        isOpen={isAddStudySetModalOpen}
        onClose={() => setIsAddStudySetModalOpen(false)}
        classId={classId}
        onSuccess={handleSuccess}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        classId={classId}
        onSuccess={handleSuccess}
      />

      <CreateAssignmentModal
        isOpen={isCreateAssignmentModalOpen}
        onClose={() => setIsCreateAssignmentModalOpen(false)}
        classId={classId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

// ── Tab Components ──────────────────────────────────────────────────────────

function StudySetsTab({ classId, canManageClass, onAdd, refreshTrigger }: { classId: number, canManageClass: boolean, onAdd: () => void, refreshTrigger?: number }) {
  const { data: studySets, isLoading, error, refetch } = useClassStudySets(classId, refreshTrigger);
  const { mutate: removeStudySet, isPending } = useRemoveStudySet();

  const handleRemove = (studySetId: number) => {
    if (confirm("Bạn có chắc muốn xoá học phần này khỏi lớp?")) {
      removeStudySet({ classId, studySetId }, { onSuccess: () => refetch() });
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary/50" /></div>;
  if (error) return <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-xl">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Danh sách học phần ({studySets.length})</h2>
        {canManageClass && (
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90">
            <PlusCircle size={14} /> Thêm học phần
          </button>
        )}
      </div>
      
      {studySets.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="mb-1 text-lg font-medium text-foreground">Chưa có học phần nào</h3>
          <p className="text-sm text-muted-foreground">Thêm học phần vào lớp để mọi người cùng học.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studySets.map(set => (
            <div key={set.id} className="relative rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition">
              <FavoriteButton studySetId={set.id} />
              <Link href={`/study-sets/${set.id}`} className="block mb-2">
                <h3 className="font-semibold hover:text-primary transition">{set.title}</h3>
              </Link>
              <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
                <span>Bởi {set.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star size={12} /> {set.favoriteCount}
                </span>
              </div>
              {canManageClass && (
                <button 
                  onClick={() => handleRemove(set.id)}
                  disabled={isPending}
                  className="absolute bottom-4 right-4 text-muted-foreground hover:text-destructive transition"
                  title="Xóa khỏi lớp"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MembersTab({ classId, canManageClass, isOwner, onAdd, currentUserId, refreshTrigger }: { classId: number, canManageClass: boolean, isOwner: boolean, onAdd: () => void, currentUserId?: number, refreshTrigger?: number }) {
  const { data: members, isLoading, error, refetch } = useClassMembers(classId, refreshTrigger);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole();

  const handleRemove = (userId: number) => {
    if (confirm("Bạn có chắc muốn xoá thành viên này?")) {
      removeMember({ classId, targetUserId: userId }, { onSuccess: () => refetch() });
    }
  };

  const handleRoleChange = (userId: number, role: string) => {
    updateRole({ classId, targetUserId: userId, role }, { onSuccess: () => refetch() });
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary/50" /></div>;
  if (error) return <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-xl">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Thành viên ({members.length})</h2>
        {canManageClass && (
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90">
            <UserPlus size={14} /> Thêm thành viên
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {members.map(member => (
            <div key={member.userId} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm flex items-center gap-2">
                    {member.username} 
                    {member.userId === currentUserId && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-md text-secondary-foreground">Bạn</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs font-medium">
                  {isOwner && member.userId !== currentUserId && member.role?.toUpperCase() !== 'OWNER' ? (
                    <select 
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                      disabled={isUpdating}
                      className="bg-transparent border border-border rounded px-2 py-1"
                    >
                      <option value="STUDENT">Thành viên</option>
                      <option value="TEACHER">Giáo viên</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-md ${member.role?.toUpperCase() === 'OWNER' ? 'bg-primary/10 text-primary font-semibold' : member.role?.toUpperCase() === 'TEACHER' ? 'bg-blue-500/10 text-blue-500 font-medium' : 'bg-muted text-muted-foreground'}`}>
                      {member.role?.toUpperCase() === 'OWNER' ? 'Chủ sở hữu' : member.role?.toUpperCase() === 'TEACHER' ? 'Giáo viên' : 'Thành viên'}
                    </span>
                  )}
                </div>

                {canManageClass && member.userId !== currentUserId && member.role !== 'OWNER' && (
                  <button 
                    onClick={() => handleRemove(member.userId)}
                    disabled={isRemoving}
                    className="text-muted-foreground hover:text-destructive transition p-1"
                    title="Xóa khỏi lớp"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignmentsTab({ classId, canManageClass, onAdd, refreshTrigger }: { classId: number, canManageClass: boolean, onAdd: () => void, refreshTrigger?: number }) {
  const { data: assignments, isLoading, error } = useClassAssignments(classId, refreshTrigger);

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary/50" /></div>;
  if (error) return <div className="text-destructive text-sm bg-destructive/10 p-4 rounded-xl">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bài tập ({assignments.length})</h2>
        {canManageClass && (
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90">
            <PlusCircle size={14} /> Tạo bài tập
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
          <FileText size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="mb-1 text-lg font-medium text-foreground">Chưa có bài tập nào</h3>
          <p className="text-sm text-muted-foreground">Giáo viên chưa giao bài tập nào cho lớp.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {assignments.map(assignment => (
            <div key={assignment.id} className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium whitespace-nowrap">
                    {assignment.timeLimit ? `${assignment.timeLimit} phút` : 'Không giới hạn'}
                  </span>
                </div>
                {assignment.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assignment.description}</p>}
                
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2"><BookOpen size={14}/> {assignment.testTitle}</div>
                  <div className="flex items-center gap-2"><UserPlus size={14}/> Giao bởi: {assignment.assignedByName}</div>
                  {assignment.dueDate && <div className="flex items-center gap-2 text-destructive"><Calendar size={14}/> Hạn: {new Date(assignment.dueDate).toLocaleString('vi-VN')}</div>}
                </div>
              </div>
              
              {assignment.currentUserAttemptCount !== undefined && assignment.currentUserAttemptCount > 0 ? (
                <Link href={`/assignment/${assignment.id}`} className="block w-full text-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Đã làm ({assignment.currentUserBestScore}%)
                </Link>
              ) : (
                <Link href={`/assignment/${assignment.id}`} className="block w-full text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-sm font-medium transition">
                  Làm bài ngay
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

function LeaveClassroomButton({ classId }: { classId: number }) {
  const router = useRouter();
  const { mutate: leaveClassroom, isPending } = useLeaveClassroom();
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <button
        onClick={() => {
          leaveClassroom(classId, {
            onSuccess: () => router.push("/classrooms"),
          });
        }}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90 w-full"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : "Xác nhận rời lớp"}
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground w-full"
    >
      <LogOut size={16} /> Rời lớp
    </button>
  );
}

function DeleteClassroomButton({ classId }: { classId: number }) {
  const router = useRouter();
  const { mutate: deleteClassroom, isPending } = useDeleteClassroom();
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <button
        onClick={() => {
          deleteClassroom(classId, {
            onSuccess: () => router.push("/classrooms"),
          });
        }}
        disabled={isPending}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : "Xác nhận xoá"}
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 size={14} /> Xoá
    </button>
  );
}

function EditClassroomModal({ isOpen, onClose, classroom, onSuccess }: any) {
  const [name, setName] = useState(classroom?.name || "");
  const [description, setDescription] = useState(classroom?.description || "");
  const { mutate: updateClassroom, isPending } = useUpdateClassroom();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateClassroom(
      classroom.id,
      { name, description },
      { onSuccess: () => { onSuccess(); onClose(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Chỉnh sửa lớp học</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Tên lớp học</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required disabled={isPending} />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]" disabled={isPending} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted" disabled={isPending}>Hủy</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90" disabled={isPending || !name.trim()}>
              {isPending && <Loader2 size={16} className="animate-spin" />} Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddStudySetModal({ isOpen, onClose, classId, onSuccess }: any) {
  const [studySetId, setStudySetId] = useState("");
  const { mutate: addStudySet, isPending: isAddingMySet } = useAddStudySetToClassroom();
  const { mutate: addFavoriteStudySet, isPending: isAddingFavoriteSet } = useAddFavoriteStudySetToClassroom();
  const { data: myStudySets, isLoading: isLoadingStudySets } = useMyStudySets();
  const { data: favoriteStudySets, isLoading: isLoadingFavorites } = useFavorites();

  if (!isOpen) return null;

  const isPending = isAddingMySet || isAddingFavoriteSet;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studySetId || isNaN(Number(studySetId))) return;
    const numId = Number(studySetId);
    
    // Check if it's my set first, if not, it must be a favorite set
    const isMySet = myStudySets?.some(s => s.id === numId);
    
    if (isMySet) {
      addStudySet({ classId, studySetId: numId }, { onSuccess: () => { onSuccess(); onClose(); setStudySetId(""); } });
    } else {
      addFavoriteStudySet({ classId, studySetId: numId }, { onSuccess: () => { onSuccess(); onClose(); setStudySetId(""); } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Thêm học phần</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Chọn học phần của bạn</label>
            <select
              value={studySetId}
              onChange={(e) => setStudySetId(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isPending || isLoadingStudySets || isLoadingFavorites}
            >
              <option value="">-- Chọn một học phần --</option>
              {myStudySets && myStudySets.length > 0 && (
                <optgroup label="Học phần của tôi">
                  {myStudySets.map((set) => (
                    <option key={`my-${set.id}`} value={set.id}>
                      {set.title}
                    </option>
                  ))}
                </optgroup>
              )}
              {favoriteStudySets && favoriteStudySets.length > 0 && (
                <optgroup label="Học phần yêu thích">
                  {favoriteStudySets.map((set) => (
                    <option key={`fav-${set.id}`} value={set.id}>
                      {set.title}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted" disabled={isPending}>Hủy</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90" disabled={isPending || !studySetId}>
              {(isPending || isLoadingStudySets || isLoadingFavorites) && <Loader2 size={16} className="animate-spin" />} Thêm vào lớp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberModal({ isOpen, onClose, classId, onSuccess }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [role, setRole] = useState("STUDENT");
  const { mutate: addMember, isPending } = useAddMember();
  const { data: members, refetch } = useClassMembers(classId);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUser(null);
      setHasSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await userApi.searchUsers(searchQuery);
          // Filter out users who are already members
          const existingIds = new Set(members?.map(m => m.userId) || []);
          setSearchResults(results.filter(u => !existingIds.has(u.id)));
          setHasSearched(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, members]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!selectedUser) return;
    addMember(
      { classId, data: { userId: selectedUser.id, role } },
      { onSuccess: () => { refetch(); if(onSuccess) onSuccess(); onClose(); setSelectedUser(null); setSearchQuery(""); setSearchResults([]); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Thêm thành viên mới</h2>
        
        {!selectedUser ? (
          <div>
            <div className="mb-4 relative">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full rounded-xl border border-input bg-background px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                placeholder="Nhập tên hoặc email để tìm..." 
              />
              {isSearching && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="max-h-[200px] overflow-y-auto border border-border rounded-xl divide-y divide-border mb-4">
                {searchResults.map(user => (
                  <div key={user.id} className="p-3 hover:bg-muted/50 flex items-center justify-between cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <button className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Chọn</button>
                  </div>
                ))}
              </div>
            )}
            {searchResults.length === 0 && hasSearched && !isSearching && (
              <div className="mb-4 p-4 text-center text-sm text-muted-foreground border border-border rounded-xl">Không tìm thấy kết quả (hoặc người dùng đã có trong lớp).</div>
            )}
          </div>
        ) : (
          <div className="mb-4 p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center justify-between">
             <div>
                <p className="font-medium text-sm">{selectedUser.username}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
             </div>
             <button onClick={() => setSelectedUser(null)} className="text-xs text-muted-foreground hover:text-foreground">Đổi</button>
          </div>
        )}

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Vai trò</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" disabled={isPending}>
            <option value="STUDENT">Thành viên</option>
            <option value="TEACHER">Giáo viên</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted" disabled={isPending}>Hủy</button>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90" disabled={isPending || !selectedUser}>
            {isPending && <Loader2 size={16} className="animate-spin" />} Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAssignmentModal({ isOpen, onClose, classId, onSuccess }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studySetId, setStudySetId] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [maxAttempt, setMaxAttempt] = useState("1");
  const [allowReview, setAllowReview] = useState(true);
  const [dueDate, setDueDate] = useState("");
  
  const [generating, setGenerating] = useState(false);
  const { mutate: createAssignment, isPending } = useCreateAssignment();
  const { data: studySets } = useClassStudySets(classId);
  const { refetch } = useClassAssignments(classId);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !studySetId) return;

    setGenerating(true);
    try {
      // Đầu tiên tạo bài kiểm tra từ học phần được chọn
      const testResponse = await testApi.generate({
        studySetId: Number(studySetId),
        timeLimit: timeLimit ? Number(timeLimit) : undefined,
        maxAttempt: maxAttempt ? Number(maxAttempt) : undefined,
        showAnswer: allowReview
      });

      // Sau đó dùng testId đó tạo bài tập
      createAssignment(
        {
          classId,
          data: {
            title,
            description,
            testId: testResponse.testId,
            timeLimit: timeLimit ? Number(timeLimit) : undefined,
            maxAttempt: maxAttempt ? Number(maxAttempt) : undefined,
            allowReview,
            dueDate: dueDate ? new Date(dueDate).getTime() ? (() => {
              const d = new Date(dueDate);
              d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
              return d.toISOString().slice(0, 19);
            })() : undefined : undefined,
          }
        },
        {
          onSuccess: () => {
            refetch();
            if(onSuccess) onSuccess();
            onClose();
            // Reset form
            setTitle("");
            setDescription("");
            setStudySetId("");
            setTimeLimit("");
            setMaxAttempt("1");
            setAllowReview(true);
            setDueDate("");
          }
        }
      );
    } catch (err) {
      alert("Lỗi khi tạo bài tập: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGenerating(false);
    }
  };

  const isLoading = isPending || generating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm overflow-y-auto py-8">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg my-auto">
        <h2 className="mb-4 text-xl font-bold">Tạo bài tập mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tiêu đề bài tập <span className="text-destructive">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required disabled={isLoading} />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px]" disabled={isLoading} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Chọn Học phần (để tạo Test) <span className="text-destructive">*</span></label>
            <select value={studySetId} onChange={(e) => setStudySetId(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" required disabled={isLoading}>
              <option value="">-- Chọn một học phần trong lớp --</option>
              {studySets?.map(set => (
                <option key={set.id} value={set.id}>{set.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Thời gian làm bài (Phút)</label>
              <input type="number" min="1" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Bỏ trống nếu ko giới hạn" className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Số lần thử tối đa</label>
              <input type="number" min="1" value={maxAttempt} onChange={(e) => setMaxAttempt(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Hạn chót nộp bài</label>
            <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="allowReview" checked={allowReview} onChange={(e) => setAllowReview(e.target.checked)} disabled={isLoading} className="rounded border-input text-primary focus:ring-primary" />
            <label htmlFor="allowReview" className="text-sm font-medium">Cho phép học sinh xem lại đáp án sau khi nộp</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-muted" disabled={isLoading}>Hủy</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90" disabled={isLoading || !title.trim() || !studySetId}>
              {isLoading && <Loader2 size={16} className="animate-spin" />} Tạo bài tập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
