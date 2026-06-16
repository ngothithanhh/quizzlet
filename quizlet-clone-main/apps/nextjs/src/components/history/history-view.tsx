"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Activity, Clock, Target, CheckCircle2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@acme/ui/card";
import { useTestHistory, useLearnHistory, useMatchHistory } from "~/hooks/use-history";

export default function HistoryView() {
  const [activeTab, setActiveTab] = useState("test");

  const { data: testHistory, isLoading: isLoadingTest } = useTestHistory();
  const { data: learnHistory, isLoading: isLoadingLearn } = useLearnHistory();
  const { data: matchHistory, isLoading: isLoadingMatch } = useMatchHistory();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm - dd/MM/yyyy", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Lịch sử Hoạt động</h1>
        <p className="mt-2 text-muted-foreground">
          Xem lại các hoạt động học tập và kiểm tra gần đây của bạn.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="test">Kiểm tra</TabsTrigger>
          <TabsTrigger value="learn">Học</TabsTrigger>
          <TabsTrigger value="match">Ghép thẻ</TabsTrigger>
        </TabsList>

        <TabsContent value="test">
          {isLoadingTest ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : !testHistory || testHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Target className="mb-4 h-12 w-12 opacity-20" />
                <p>Bạn chưa làm bài kiểm tra nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {testHistory.map((item) => (
                <Card key={item.attemptId} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <Link href={`/study-sets/${item.studySetId}`} className="hover:text-primary hover:underline">
                        {item.studySetTitle}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(item.submittedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-violet-600">{item.score}%</span>
                      <span className="text-sm text-muted-foreground">điểm số</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="learn">
          {isLoadingLearn ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : !learnHistory || learnHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Activity className="mb-4 h-12 w-12 opacity-20" />
                <p>Bạn chưa học thẻ nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {learnHistory.map((item) => (
                <Card key={item.attemptId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <Link href={`/study-sets/${item.studySetId}`} className="hover:text-primary hover:underline">
                        {item.studySetTitle}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(item.studiedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">Phản hồi:</span>
                        <span className="text-sm">{item.result}</span>
                      </div>
                      {item.responseTime > 0 && (
                        <span className="text-xs text-muted-foreground">{item.responseTime}ms</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="match">
          {isLoadingMatch ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : !matchHistory || matchHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <CheckCircle2 className="mb-4 h-12 w-12 opacity-20" />
                <p>Bạn chưa chơi ghép thẻ nào.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matchHistory.map((item) => (
                <Card key={item.sessionId} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <Link href={`/study-sets/${item.studySetId}`} className="hover:text-primary hover:underline">
                        {item.studySetTitle}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDate(item.completedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-indigo-600">{item.score}</span>
                        <span className="text-sm text-muted-foreground">điểm</span>
                      </div>
                      <span className="text-sm font-medium">
                        {item.timeMs ? `${(item.timeMs / 1000).toFixed(1)} giây` : "-- giây"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
