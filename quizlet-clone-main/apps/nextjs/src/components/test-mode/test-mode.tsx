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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useStudySet } from "~/hooks/use-study-sets";
import { useGenerateTest, useSubmitTest, useTestById } from "~/hooks/use-test";
import type {
  QuestionAnswerRequest,
  TestCardResponse,
  TestResultResponse,
} from "~/lib/api-client";
import { useAuth } from "~/contexts/auth-context";

type TestState = "setup" | "testing" | "result";

export default function TestMode({
  studySetId,
  testId,
}: {
  studySetId?: number;
  testId?: number;
}) {
  const { isLoggedIn } = useAuth();
  const [testState, setTestState] = useState<TestState>("setup");

  // Setup state
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Testing state
  const [testData, setTestData] = useState<TestCardResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Result state
  const [resultData, setResultData] = useState<TestResultResponse | null>(null);

  const { data: studySet, isLoading: isLoadingStudySet } = useStudySet(studySetId ?? -1);
  const { data: preFetchedTest, isLoading: isLoadingTest } = useTestById(testId ?? null);
  const { mutate: generateTest, isPending: isGenerating } = useGenerateTest();
  const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest();

  // Timer logic
  useEffect(() => {
    if (testState === "testing" && timeLeft !== null && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft((prev) => prev! - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (testState === "testing" && timeLeft === 0) {
      handleSubmit(); // Auto submit when time runs out
    }
  }, [testState, timeLeft]);

  // If testId is provided, jump directly to testing
  useEffect(() => {
    if (testId && preFetchedTest && testState === "setup") {
      setTestData(preFetchedTest);
      setTestState("testing");
      // Mặc định cho assignment nếu không có timeLeft thì null (để backend validate hoặc tuỳ ý), 
      // ở đây assignment có timeLimit ở db nhưng response getTestById hiện chưa trả về timeLimit.
    }
  }, [testId, preFetchedTest, testState]);

  const handleStartTest = () => {
    if (!studySet) return;
    generateTest(
      {
        studySetId: studySet.id,
        timeLimit: timeLimit > 0 ? timeLimit : undefined,
        maxAttempt: 1,
        showAnswer,
      },
      {
        onSuccess: (data) => {
          setTestData(data);
          setAnswers({});
          if (timeLimit > 0) {
            setTimeLeft(timeLimit * 60); // Convert minutes to seconds
          } else {
            setTimeLeft(null);
          }
          setTestState("testing");
        },
      },
    );
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

    submitTest(
      {
        testId: testData.testId,
        answers: formattedAnswers,
      },
      {
        onSuccess: (data) => {
          setResultData(data);
          setTestState("result");
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    );
  };

  const handleRestart = () => {
    if (testId) {
      // Nếu đang làm bài assignment, hủy bài thì back lại
      window.history.back();
      return;
    }
    setTestState("setup");
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
        <p className="text-xl font-medium text-muted-foreground">Vui lòng đăng nhập để làm bài kiểm tra.</p>
        <Link href="/login" className="rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-violet-500">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if ((studySetId && isLoadingStudySet) || (testId && isLoadingTest)) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (studySetId && !studySet) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Không tìm thấy học phần.
      </div>
    );
  }

  // ── Setup View ─────────────────────────────────────────────────────────────
  if (testState === "setup") {
    if (testId || !studySet) return null; // Đợi useEffect chuyển sang testing
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="border-b border-border p-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-500">
              <Settings2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{studySet.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tùy chỉnh bài thi của bạn. Hệ thống sẽ chọn ngẫu nhiên các câu
              hỏi trắc nghiệm từ {studySet.flashcards.length} thẻ học của học phần này.
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Thời gian làm bài (Phút)
              </label>
              <select
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-semibold text-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
              >
                <option value={0}>Không giới hạn</option>
                <option value={5}>5 phút</option>
                <option value={10}>10 phút</option>
                <option value={15}>15 phút</option>
                <option value={30}>30 phút</option>
              </select>
            </div>

            <button
              onClick={handleStartTest}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
              {isGenerating ? "Đang tạo đề thi..." : "Bắt đầu làm bài"}
            </button>
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
                onClick={handleRestart}
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
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-4 text-violet-600 dark:text-violet-400"
                            >
                              <CheckCircle2 size={20} />
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
        </div>

        {/* Floating Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center bg-gradient-to-t from-background via-background/80 to-transparent pb-8 pt-20 pointer-events-none">
          <div className="pointer-events-auto mx-4 w-full max-w-3xl">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-base font-black text-background shadow-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : answeredCount < testData.questions.length ? (
                `Nộp bài (${answeredCount}/${testData.questions.length})`
              ) : (
                <><CheckCircle2 className="h-5 w-5" /> Hoàn thành bài thi</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Result View ────────────────────────────────────────────────────────────
  if (testState === "result" && resultData && testData) {
    const { score, correctAnswersCount, totalQuestions, results } = resultData;
    const isPassed = score >= 50;

    return (
      <div className="mx-auto w-full max-w-3xl space-y-8 pb-10">
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div
            className={`flex flex-col items-center justify-center p-12 text-center ${
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
            <p className="mt-2 rounded-full bg-background px-4 py-1 text-sm font-semibold text-muted-foreground">
              Đúng {correctAnswersCount} / {totalQuestions} câu
            </p>
          </div>
          <div className="flex items-center gap-4 border-t border-border bg-muted/50 p-6">
            <button
              onClick={handleRestart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 font-bold text-primary-foreground shadow-lg transition hover:bg-violet-500"
            >
              <RotateCcw size={18} />
              Làm lại bài
            </button>
            <Link
              href={`/study-sets/${studySet?.id || testData.studysetId}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 font-bold text-foreground shadow-lg transition hover:bg-muted"
            >
              Quay về học phần
            </Link>
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

                <div className="ml-14 space-y-3">
                  {!isCorrect && result.userAnswer && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm">
                      <span className="block mb-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Bạn chọn: </span>
                      <span className="text-base font-medium text-red-700 dark:text-red-300">{result.userAnswer}</span>
                    </div>
                  )}
                  {!isCorrect && !result.userAnswer && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm">
                      <span className="block mb-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Bạn chọn: </span>
                      <span className="italic text-red-700 dark:text-red-300">Chưa trả lời</span>
                    </div>
                  )}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm">
                    <span className="block mb-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Đáp án đúng: </span>
                    <span className="text-base font-medium text-emerald-700 dark:text-emerald-300">{result.correctAnswer}</span>
                  </div>
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
