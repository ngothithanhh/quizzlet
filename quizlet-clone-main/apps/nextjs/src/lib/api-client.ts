/**
 * Spring Boot REST API client.
 * All requests automatically include the JWT access token from cookies.
 */

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "~/lib/auth";
import { env } from "~/env";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FlashcardMediaRequest {
  url: string;
  type: "IMAGE" | "AUDIO";
  side: "TERM" | "DEFINITION";
}

export interface FlashcardMediaResponse {
  id: number;
  url: string;
  type: "IMAGE" | "AUDIO";
  side: "TERM" | "DEFINITION";
}

export interface FlashcardRequest {
  term: string;
  definition: string;
  position?: number;
  studySetId?: number;
  mediaList?: FlashcardMediaRequest[];
}

export interface FlashcardResponse {
  id: number;
  term: string;
  definition: string;
  position: number;
  updatedAt: string;
  studySetId: number;
  mediaList: FlashcardMediaResponse[];
}

export interface StudySetRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
  flashcards?: FlashcardRequest[];
}

export interface StudySetResponse {
  id: number;
  title: string;
  description?: string;
  isPublic: boolean;
  favoriteCount: number;
  userId: number;
  username: string;
  createdAt: string;
  flashcards: FlashcardResponse[];
}

export interface StudySetSimpleResponse {
  id: number;
  title: string;
  description?: string;
  isPublic: boolean;
  favoriteCount: number;
  username: string;
  totalFlashcards: number;
}

export interface CloneFlashcardsRequest {
  targetStudySetId: number;
  sourceStudySetId?: number;
  sourceFlashcardIds?: number[];
}

export interface MatchCardResponse {
  flashcardId: number;
  term: string;
  definition: string;
}

export interface MatchStartResponse {
  sessionId: number;
  matchSessionId: number;
  totalPairs: number;
  responses: MatchCardResponse[];
}

export interface MatchAnswerRequest {
  matchSessionId: number;
  flashcardId: number;
  selectedTerm: string;
  selectedDefinition: string;
}

export interface MatchAnswerResponse {
  correct: boolean;
  matchedPairs: number;
  wrongAttempts: number;
  completed: boolean;
  score: number;
}

// ── Test API Types ────────────────────────────────────────────────────────────

export interface CreateTestRequest {
  studySetId: number;
  timeLimit?: number;
  maxAttempt?: number;
  showAnswer?: boolean;
}

export interface TestOptionResponse {
  id: number;
  optionText: string;
  isCorrect?: boolean;
}

export interface TestQuestionResponse {
  id: number;
  flashcardId: number;
  question: string;
  correctAnswer: string;
  options: TestOptionResponse[];
}

export interface TestCardResponse {
  testId: number;
  studysetId: number;
  title: string;
  questions: TestQuestionResponse[];
}

export interface QuestionAnswerRequest {
  questionId: number;
  answer: string;
}

export interface TestSubmitRequest {
  testId: number;
  answers: QuestionAnswerRequest[];
}

export interface TestAnswerResponse {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface TestResultResponse {
  attemptId: number;
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
  results: TestAnswerResponse[];
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

export interface ClassroomRequest {
  name: string;
  description: string;
}

export interface ClassroomResponse {
  id: number;
  name: string;
  description: string;
  inviteCode: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  memberCount: number;
  studySetCount: number;
  currentUserRole: string;
}

export interface AddMemberRequest {
  userId: number;
  role: string;
}

export interface ClassMemberResponse {
  classId: number;
  userId: number;
  username: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface AssignmentRequest {
  title: string;
  description?: string;
  testId: number;
  timeLimit?: number;
  maxAttempt?: number;
  allowReview?: boolean;
  dueDate?: string;
}

export interface AssignmentResponse {
  id: number;
  title: string;
  description: string;
  classId: number;
  testId: number;
  testTitle: string;
  assignedById: number;
  assignedByName: string;
  timeLimit: number;
  maxAttempt: number;
  allowReview: boolean;
  dueDate: string;
  createdAt: string;
  currentUserBestScore?: number;
  currentUserAttemptCount?: number;
}

// ── Assignment Work API Types ────────────────────────────────────────────────

export interface AssignmentStartResponse {
  assignmentId: number;
  testId: number;
  title: string;
  timeLimit?: number;
  dueDate?: string;
  test: TestCardResponse;
}

export interface AssignmentSubmitRequest {
  answers: QuestionAnswerRequest[];
}

export interface AssignmentAttemptResponse {
  id: number;
  attemptNumber: number;
  score: number;
  startedAt: string;
  submittedAt: string;
}

export interface AssignmentSubmissionResponse {
  assignmentId: number;
  userId: number;
  bestScore: number;
  attemptCount: number;
  maxAttempt: number;
  status: string;
  completedAt: string;
  attempts: AssignmentAttemptResponse[];
}

export interface TestHistoryResponse {
  attemptId: number;
  studySetId: number;
  studySetTitle: string;
  score: number;
  startedAt: string;
  submittedAt: string;
}

export interface LearnHistoryResponse {
  attemptId: number;
  studySetId: number;
  studySetTitle: string;
  result: string;
  responseTime: number;
  studiedAt: string;
}

export interface MatchHistoryResponse {
  sessionId: number;
  studySetId: number;
  studySetTitle: string;
  timeMs: number;
  score: number;
  startedAt: string;
  completedAt: string;
}

export interface UserSearchResponse {
  id: number;
  username: string;
  email: string;
}

export interface NotificationResponse {
  id: number;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  referenceId: number;
  referenceType: string;
  createdAt: string;
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const getHeaders = (token: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  let token = getAccessToken();
  let response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: getHeaders(token),
  });

  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized - No refresh token");
    }

    if (isRefreshing) {
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        response = await fetch(`${BACKEND_URL}${path}`, {
          ...options,
          headers: getHeaders(newToken),
        });
      } catch (err) {
        throw err;
      }
    } else {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh?token=${encodeURIComponent(refreshToken)}`, {
          method: "POST",
        });

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshRes.json() as { accessToken: string; refreshToken: string };
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        
        setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        response = await fetch(`${BACKEND_URL}${path}`, {
          ...options,
          headers: getHeaders(newAccessToken),
        });
      } catch (err) {
        processQueue(err as Error, null);
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
  }

  if (!response.ok) {
    let message = `API error ${response.status}`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as unknown as Promise<T>;
  }
}

// ── Study Set API ─────────────────────────────────────────────────────────────

export const studySetApi = {
  /** Create a new study set (with optional flashcards) */
  create: (data: StudySetRequest) =>
    apiFetch<StudySetResponse>("/api/studysets/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Get all public study sets, optionally filtered by keyword */
  getAll: (keyword?: string) => {
    const url = keyword
      ? `/api/studysets?keyword=${encodeURIComponent(keyword)}`
      : "/api/studysets";
    return apiFetch<StudySetSimpleResponse[]>(url);
  },

  /** Get latest study sets */
  getLatest: () =>
    apiFetch<StudySetSimpleResponse[]>("/api/studysets/latest"),

  /** Get top favorite study sets */
  getTopFavorites: () =>
    apiFetch<StudySetSimpleResponse[]>("/api/studysets/top-favorites"),

  /** Get the current user's own study sets */
  getMyStudySets: () =>
    apiFetch<StudySetSimpleResponse[]>("/api/studysets/me"),

  /** Get a single study set by id (includes flashcards) */
  getById: (id: number) =>
    apiFetch<StudySetResponse>(`/api/studysets/${id}`),

  /** Update an existing study set */
  update: (id: number, data: StudySetRequest) =>
    apiFetch<StudySetResponse>(`/api/studysets/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** Toggle public/private visibility */
  setVisibility: (id: number, isPublic: boolean) =>
    apiFetch<StudySetResponse>(`/api/studysets/${id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isPublic }),
    }),

  /** Permanently delete a study set */
  delete: (id: number) =>
    apiFetch<void>(`/api/studysets/delete/${id}`, { method: "DELETE" }),
};

// ── Flashcard API ─────────────────────────────────────────────────────────────


export const flashcardApi = {
  /** Create a single flashcard */
  create: (data: FlashcardRequest) =>
    apiFetch<FlashcardResponse>("/api/flashcards/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Update a flashcard */
  update: (id: number, data: FlashcardRequest) =>
    apiFetch<FlashcardResponse>(`/api/flashcards/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** Delete a flashcard */
  delete: (id: number) =>
    apiFetch<void>(`/api/flashcards/delete/${id}`, { method: "DELETE" }),

  /** Get all flashcards for a study set */
  getByStudySet: (studySetId: number) =>
    apiFetch<FlashcardResponse[]>(
      `/api/flashcards/by-studyset/${studySetId}`,
    ),

  /** Clone flashcards from one study set to another */
  clone: (data: CloneFlashcardsRequest) =>
    apiFetch<{ message: string }>("/api/flashcards/clone", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Export flashcards to Excel */
  exportUrl: (studySetId: number) =>
    `${BACKEND_URL}/api/flashcards/export/${studySetId}`,

  /** Download import template */
  templateUrl: () => `${BACKEND_URL}/api/flashcards/template`,

  /** Import flashcards from an Excel file */
  import: async (studySetId: number, file: File) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BACKEND_URL}/api/flashcards/import/${studySetId}`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Import failed: ${response.status}`);
    }

    return response.json() as Promise<{ message: string }>;
  },
};

// ── Match API ─────────────────────────────────────────────────────────────────

export const matchApi = {
  /** Bắt đầu phiên chơi ghép thẻ */
  start: (studySetId: number) =>
    apiFetch<MatchStartResponse>(`/api/match/start/${studySetId}`, {
      method: "POST",
    }),

  /** Gửi câu trả lời để kiểm tra */
  answer: (data: MatchAnswerRequest) =>
    apiFetch<MatchAnswerResponse>("/api/match/answer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Test API ──────────────────────────────────────────────────────────────────

export const testApi = {
  /** Lấy chi tiết bài test đã tạo */
  getById: (id: number) =>
    apiFetch<TestCardResponse>(`/api/test/${id}`),

  /** Tạo bài test từ study set */
  generate: (data: CreateTestRequest) =>
    apiFetch<TestCardResponse>("/api/test/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Nộp bài test và lấy kết quả */
  submit: (data: TestSubmitRequest) =>
    apiFetch<TestResultResponse>("/api/test/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── History API ───────────────────────────────────────────────────────────────

export const historyApi = {
  /** Lấy lịch sử làm bài test */
  getTests: () => apiFetch<TestHistoryResponse[]>("/api/history/tests"),

  /** Lấy lịch sử học thẻ */
  getLearns: () => apiFetch<LearnHistoryResponse[]>("/api/history/learns"),

  /** Lấy lịch sử ghép thẻ */
  getMatches: () => apiFetch<MatchHistoryResponse[]>("/api/history/matches"),
};

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  /** Gửi OTP quên mật khẩu */
  sendForgotPasswordOtp: (email: string) =>
    apiFetch<{ message: string }>(
      `/api/auth/forgot-password/otp?email=${encodeURIComponent(email)}`,
      { method: "POST" },
    ),

  /** Đặt lại mật khẩu với OTP */
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    apiFetch<{ message: string }>("/api/auth/forgot-password/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Đổi mật khẩu (cần đăng nhập) */
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Classroom API ─────────────────────────────────────────────────────────────

export const classroomApi = {
  /** Tạo lớp học mới */
  create: (data: ClassroomRequest) =>
    apiFetch<Record<string, any>>("/api/classroom/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Lấy danh sách lớp học của tôi */
  getMyClassrooms: () =>
    apiFetch<ClassroomResponse[]>("/api/classroom/getMyClassrooms"),

  /** Lấy chi tiết lớp học */
  getDetail: (id: number) =>
    apiFetch<ClassroomResponse>(`/api/classroom/getDetailMyClassroom/${id}`),

  /** Cập nhật lớp học */
  update: (id: number, data: ClassroomRequest) =>
    apiFetch<ClassroomResponse>(`/api/classroom/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** Xóa lớp học */
  delete: (id: number) =>
    apiFetch<void>(`/api/classroom/delete/${id}`, {
      method: "DELETE",
    }),

  /** Tham gia lớp học bằng mã */
  join: async (classCode: string) => {
    const token = getAccessToken();
    const response = await fetch(`${BACKEND_URL}/api/classroom/join/${classCode}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      let message = `Lỗi ${response.status}`;
      try {
        const data = await response.json();
        if (data.message) message = data.message;
      } catch {
        // ignore
      }
      throw new Error(message);
    }
    return response.text();
  },

  /** Thêm học phần vào lớp học */
  addStudySet: (classId: number, studySetId: number) =>
    apiFetch<ClassroomResponse>(`/api/classroom/${classId}/add-studyset/${studySetId}`, {
      method: "POST",
    }),

  /** Thêm học phần yêu thích vào lớp học */
  addFavoriteStudySet: (classId: number, studySetId: number) =>
    apiFetch<ClassroomResponse>(`/api/classroom/${classId}/add-favorite-studyset/${studySetId}`, {
      method: "POST",
    }),

  /** Rời khỏi lớp học */
  leaveClassroom: (classId: number) =>
    apiFetch<string>(`/api/classroom/leave/${classId}`, {
      method: "POST",
    }),

  /** Lấy danh sách thành viên */
  getClassMembers: (classId: number) =>
    apiFetch<ClassMemberResponse[]>(`/api/classroom/getClassMembers/${classId}`),

  /** Thêm thành viên vào lớp */
  addMember: (classId: number, data: AddMemberRequest) =>
    apiFetch<string>(`/api/classroom/add-member/${classId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Xoá thành viên khỏi lớp */
  removeMember: (classId: number, targetUserId: number) =>
    apiFetch<string>(`/api/classroom/delete-member/${classId}/${targetUserId}`, {
      method: "DELETE",
    }),

  /** Cập nhật vai trò thành viên */
  updateMemberRole: (classId: number, targetUserId: number, role: string) =>
    apiFetch<ClassMemberResponse>(`/api/classroom/update-role-member/${classId}/${targetUserId}/${role}`, {
      method: "PUT",
    }),

  /** Lấy danh sách học phần của lớp */
  getStudySetsByClassroom: (classId: number) =>
    apiFetch<StudySetResponse[]>(`/api/classroom/studysets/${classId}`),

  /** Xóa học phần khỏi lớp */
  removeStudySet: (classId: number, studySetId: number) =>
    apiFetch<string>(`/api/classroom/delete-studyset/${classId}/${studySetId}`, {
      method: "DELETE",
    }),
};

// ── Assignment API ────────────────────────────────────────────────────────────

export const assignmentApi = {
  /** Tạo bài tập mới cho lớp */
  create: (classId: number, data: AssignmentRequest) =>
    apiFetch<AssignmentResponse>(`/api/assignments/create/${classId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Lấy danh sách bài tập của lớp */
  getClassAssignments: (classId: number) =>
    apiFetch<AssignmentResponse[]>(`/api/assignments/get-assignments/${classId}`),

  /** Lấy chi tiết một bài tập */
  getDetail: (assignmentId: number) =>
    apiFetch<AssignmentResponse>(`/api/assignments/assignments/${assignmentId}`),

  /** Xóa một bài tập */
  delete: (assignmentId: number) =>
    apiFetch<void>(`/api/assignments/assignments/${assignmentId}`, {
      method: "DELETE",
    }),
};

// ── Assignment Work API ───────────────────────────────────────────────────────

export const assignmentWorkApi = {
  /** Bắt đầu làm bài tập */
  start: (assignmentId: number) =>
    apiFetch<AssignmentStartResponse>(`/api/assignments/${assignmentId}/start`, {
      method: "POST",
    }),

  /** Nộp bài tập */
  submit: (assignmentId: number, data: AssignmentSubmitRequest) =>
    apiFetch<TestResultResponse>(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Lấy kết quả làm bài tập của mình */
  getMyResult: (assignmentId: number) =>
    apiFetch<AssignmentSubmissionResponse>(`/api/assignments/${assignmentId}/my-result`),
};

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface UserProfileUpdateRequest {
  username: string;
  avatarUrl?: string;
}

export const userApi = {
  /** Lấy thông tin cá nhân */
  getMyProfile: () =>
    apiFetch<UserProfileResponse>("/api/users/me"),

  /** Cập nhật thông tin cá nhân */
  updateMyProfile: (data: UserProfileUpdateRequest) =>
    apiFetch<UserProfileResponse>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /** Tìm kiếm người dùng bằng email hoặc tên */
  searchUsers: (query: string) =>
    apiFetch<UserSearchResponse[]>(`/api/users/search?query=${encodeURIComponent(query)}`),

  /** Xoá tài khoản người dùng */
  deleteUser: (id: number) =>
    apiFetch<void>(`/api/users/${id}`, {
      method: "DELETE",
    }),
};

// ── Notification API ──────────────────────────────────────────────────────────

export const notificationApi = {
  getMyNotifications: () =>
    apiFetch<NotificationResponse[]>("/api/notifications"),

  markAsRead: (id: number) =>
    apiFetch<void>(`/api/notifications/${id}/read`, { method: "PUT" }),

  markAllAsRead: () =>
    apiFetch<void>("/api/notifications/read-all", { method: "PUT" }),

  getUnreadCount: () =>
    apiFetch<number>("/api/notifications/unread-count"),
};

// ── Favorite API ──────────────────────────────────────────────────────────────

export const favoriteApi = {
  add: (studySetId: number) =>
    apiFetch<string>(`/api/favorites/${studySetId}`, { method: "POST" }),

  remove: (studySetId: number) =>
    apiFetch<string>(`/api/favorites/${studySetId}`, { method: "DELETE" }),

  getMyFavorites: () =>
    apiFetch<StudySetResponse[]>("/api/favorites/get-my-farvorites"),
};

// ── Media API ─────────────────────────────────────────────────────────────────

export interface MediaUploadResponse {
  url: string;
  type: "IMAGE" | "AUDIO" | "VIDEO";
}

export const mediaApi = {
  upload: async (file: File) => {
    const token = getAccessToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BACKEND_URL}/api/media/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json() as Promise<MediaUploadResponse>;
  },
};

// ── Text To Speech API ────────────────────────────────────────────────────────

export interface TextToSpeechRequest {
  text: string;
  languageCode: string;
  voiceName?: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
}

export const ttsApi = {
  synthesize: (data: TextToSpeechRequest) =>
    apiFetch<TextToSpeechResponse>("/api/tts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Folder API ────────────────────────────────────────────────────────────────

export interface FolderRequest {
  name: string;
  description?: string;
}

export interface FolderResponse {
  id: number;
  name: string;
  userId: number;
  userName: string;
  studySets: StudySetSimpleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderSimpleResponse {
  id: number;
  name: string;
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export const folderApi = {
  create: (data: FolderRequest) =>
    apiFetch<FolderResponse>("/api/folders/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: FolderRequest) =>
    apiFetch<FolderResponse>(`/api/folders/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<string>(`/api/folders/delete/${id}`, {
      method: "DELETE",
    }),

  getById: (id: number) =>
    apiFetch<FolderResponse>(`/api/folders/${id}`),

  getMyFolders: () =>
    apiFetch<FolderSimpleResponse[]>("/api/folders/get-all"),

  addStudySet: (folderId: number, studySetId: number) =>
    apiFetch<FolderResponse>(`/api/folders/add-studyset/${folderId}/${studySetId}`, {
      method: "POST",
    }),

  removeStudySet: (folderId: number, studySetId: number) =>
    apiFetch<FolderResponse>(`/api/folders/delete-studyset/${folderId}/${studySetId}`, {
      method: "DELETE",
    }),
};

