"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Settings2,
  XCircle,
  Play,
  RotateCcw,
  Loader2,
  Calendar,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useMyAssignmentResult, useStartAssignment, useSubmitAssignment, useAssignmentDetail } from "~/hooks/use-assignment-work";
import type {
  QuestionAnswerRequest,
  TestResultResponse,
  TestCardResponse,
} from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";

type AssignmentTestState = "overview" | "testing" | "result";

export default function AssignmentTestMode({ assignmentId }: { assignmentId: number }) {
  const { isLoggedIn } = useAuth();
  const [testState, setTestState] = useState<AssignmentTestState>("overview");

  // Fetch initial data
  const { data: assignmentDetail, isLoading: isLoadingDetail } = useAssignmentDetail(assignmentId);
  const { data: myResult, isLoading: isLoadingResult, refetch: refetchResult } = useMyAssignmentResult(assignmentId);

  // Testing state
  const [testData, setTestData] = useState<TestCardResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Result state
  const [resultData, setResultData] = useState<TestResultResponse | null>(null);

  const { mutate: startAssignment, isPending: isStarting } = useStartAssignment();
  const { mutate: submitAssignment, isPending: isSubmitting } = useSubmitAssignment();

  // Timer logic
  useEffect(() => {
    if (testState === "testing" && timeLeft !== null && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft((prev) => prev! - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (testState === "testing" && timeLeft === 0) {
      handleSubmit(); // Auto submit when time runs out
    }
  }, [testState, timeLeft]);

  const handleStartTest = () => {
    startAssignment(assignmentId, {
      onSuccess: (data) => {
        setTestData(data.test);
        setAnswers({});
        if (data.timeLimit && data.timeLimit > 0) {
          setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
        } else {
          setTimeLeft(null);
        }
        setTestState("testing");
      },
      onError: (err: any) => {
        alert(err.message || "Không thể bắt đầu làm bài!");
      }
    });
  };

  const handleSelectAnswer = (questionId: number, answerText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  const handleSubmit = () => {
    if (!testData) return;

    const formattedAnswers: QuestionAnswerRequest[] = Object.entries(
      answers,
    ).map(([qId, ans]) => ({
      questionId: parseInt(qId, 10),
      answer: ans,
    }));

    submitAssignment(
      {
        assignmentId,
        data: { answers: formattedAnswers },
      },
      {
        onSuccess: (data) => {
          setResultData(data);
          setTestState("result");
          refetchResult(); // Refetch overview data for next time
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    );
  };

  const handleRestart = () => {
    setTestState("overview");
    setTestData(null);
    setResultData(null);
    setAnswers({});
    setTimeLeft(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-xl font-medium text-muted-foreground">Vui lòng đăng nhập để làm bài tập.</p>
        <Link href="/login" className="rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-violet-500">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (isLoadingDetail || isLoadingResult) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!assignmentDetail) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Không tìm thấy bài tập.
      </div>
    );
  }

  // ── Overview View ─────────────────────────────────────────────────────────────
  if (testState === "overview") {
    const isOverdue = assignmentDetail.dueDate && new Date(assignmentDetail.dueDate) < new Date();
    const isOutOfAttempts = myResult && assignmentDetail.maxAttempt && myResult.attemptCount >= assignmentDetail.maxAttempt;
    const canStart = !isOverdue && !isOutOfAttempts;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="border-b border-border p-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-500">
              <Award size={32} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{assignmentDetail.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {assignmentDetail.description || "Hãy hoàn thành bài tập này nhé."}
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">Thời gian</p>
                <p className="mt-1 font-semibold">
                  {assignmentDetail.timeLimit ? `${assignmentDetail.timeLimit} phút` : "Không giới hạn"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">Hạn nộp</p>
                <p className="mt-1 font-semibold text-destructive">
                  {assignmentDetail.dueDate ? new Date(assignmentDetail.dueDate).toLocaleString("vi-VN") : "Không có"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">Lượt làm bài</p>
                <p className="mt-1 font-semibold">
                  {myResult?.attemptCount || 0} / {assignmentDetail.maxAttempt || "∞"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">Điểm cao nhất</p>
                <p className="mt-1 font-semibold text-emerald-500 text-lg">
                  {myResult?.bestScore ? `${myResult.bestScore}%` : "Chưa có"}
                </p>
              </div>
            </div>

            {myResult && myResult.attempts && myResult.attempts.length > 0 && (
              <div className="border-t border-border pt-6 mt-4">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Lịch sử làm bài</h3>
                <div className="space-y-3">
                  {myResult.attempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-4 border border-border/50 transition hover:bg-muted/50">
                      <div>
                        <p className="font-semibold text-foreground">Lần {attempt.attemptNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(attempt.submittedAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${attempt.score >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {attempt.score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {canStart ? (
              <button
                onClick={handleStartTest}
                disabled={isStarting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isStarting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
                {isStarting ? "Đang chuẩn bị đề..." : "Bắt đầu làm bài"}
              </button>
            ) : (
              <div className="rounded-2xl bg-destructive/10 p-4 text-center text-destructive font-semibold">
                {isOverdue ? "Bài tập đã hết hạn!" : "Bạn đã hết lượt làm bài!"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Testing View ───────────────────────────────────────────────────────────
  if (testState === "testing" && testData) {
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / testData.questions.length) * 100;

    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Sticky Header */}
        <div className="sticky top-16 z-20 overflow-hidden rounded-2xl border border-border bg-background/90 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                title="Hủy bài thi"
              >
                <XCircle size={22} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tiến độ</p>
                <p className="text-sm font-semibold text-foreground">
                  {answeredCount} / {testData.questions.length} câu
                </p>
              </div>
            </div>
            {timeLeft !== null && (
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-sm font-bold ${
                  timeLeft < 60
                    ? "animate-pulse bg-red-500/10 text-red-500"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                <Clock size={16} />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <div className="h-1.5 w-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 pb-24">
          <AnimatePresence mode="popLayout">
            {testData.questions.map((q, index) => {
              const isAnswered = !!answers[q.id];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-3xl border transition-colors duration-300 ${isAnswered ? "border-violet-500/20 bg-violet-500/5" : "border-border bg-card"} p-6 md:p-8`}
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-foreground leading-relaxed">
                      {q.question}
                    </h3>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2 ml-12">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.optionText;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectAnswer(q.id, opt.optionText)}
                          className={`relative flex min-h-[60px] w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                            isSelected
                              ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-md shadow-violet-500/10"
                              : "border-border bg-background text-muted-foreground hover:border-violet-500/30 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              isSelected ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {opt.optionText}
                          </span>
                          {isSelected && (
                            <motion.div
                              layoutId={`check-${q.id}`}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white"
                            >
                              <CheckCircle2 size={14} />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end pt-8"
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group flex items-center gap-2 rounded-2xl bg-violet-600 px-8 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-violet-500/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/40 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang nộp bài...
                </>
              ) : (
                <>
                  Nộp bài ngay
                  <ArrowLeft className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Result View ────────────────────────────────────────────────────────────
  if (testState === "result" && resultData && testData) {
    const { score, correctAnswersCount, totalQuestions, results } = resultData;
    const isPassed = score >= 50;

    return (
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-3xl border border-border bg-card text-center shadow-2xl"
        >
          <div
            className={`p-12 ${
              isPassed ? "bg-emerald-500/10" : "bg-red-500/10"
            }`}
          >
            <div className="mb-4 text-7xl">{isPassed ? "🏆" : "💪"}</div>
            <h2
              className={`mb-2 text-6xl font-black tracking-tighter ${
                isPassed ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {score}%
            </h2>
            <p className="text-xl font-bold text-foreground">
              {isPassed ? "Xuất sắc! Bạn làm rất tốt." : "Cố gắng hơn ở lần sau nhé!"}
            </p>
            <p className="mt-2 rounded-full bg-background px-4 py-1 text-sm font-semibold text-muted-foreground inline-block">
              Đúng {correctAnswersCount} / {totalQuestions} câu
            </p>
          </div>
          <div className="flex items-center gap-4 border-t border-border bg-muted/50 p-6">
            <button
              onClick={handleRestart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 font-bold text-primary-foreground shadow-lg transition hover:bg-violet-500"
            >
              <RotateCcw size={18} />
              Chi tiết bài tập
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 font-bold text-foreground shadow-lg transition hover:bg-muted"
            >
              Quay về lớp học
            </button>
          </div>
        </motion.div>

        {/* Detailed Review */}
        <div className="space-y-4">
          <h3 className="mb-6 px-2 text-lg font-bold uppercase tracking-widest text-muted-foreground">
            Chi tiết đáp án
          </h3>
          {testData.questions.map((q, index) => {
            const result = results.find((r) => r.questionId === q.id);
            if (!result) return null;

            const isCorrect = result.isCorrect;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                key={q.id}
                className={`rounded-3xl border p-6 md:p-8 ${
                  isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="mb-6 flex items-start gap-4">
                  <div className="mt-1 shrink-0 rounded-full bg-background p-1">
                    {isCorrect ? (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : (
                      <XCircle className="text-red-500" size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground leading-relaxed">
                      <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                      {q.question}
                    </h4>
                  </div>
                </div>

                <div className="ml-12 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Đáp án của bạn
                    </p>
                    <p
                      className={`font-semibold ${
                        isCorrect ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {result.userAnswer || "(Không trả lời)"}
                    </p>
                  </div>
                  {!isCorrect && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-sm">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">
                        Đáp án đúng
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {result.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
