"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authApi } from "~/lib/api-client";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Vui lòng nhập email");
    
    setIsLoading(true);
    setError("");
    try {
      const res = await authApi.sendForgotPasswordOtp(email);
      setSuccess(res.message || "Đã gửi mã OTP đến email của bạn");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return setError("Vui lòng nhập mã OTP");
    if (!newPassword.trim()) return setError("Vui lòng nhập mật khẩu mới");
    if (newPassword.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự");

    setIsLoading(true);
    setError("");
    try {
      const res = await authApi.resetPassword({ email, otp, newPassword });
      setSuccess(res.message || "Đổi mật khẩu thành công");
      // setTimeout to redirect to home or login
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === 1
            ? "Nhập email của bạn để nhận mã xác minh."
            : "Nhập mã OTP và mật khẩu mới của bạn."}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 text-center">
          {success}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Gửi mã xác nhận
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Mã OTP
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Nhập mã 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={success !== ""}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              Mật khẩu mới
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={success !== ""}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || success !== ""}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Cập nhật mật khẩu
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-primary hover:underline"
              disabled={success !== ""}
            >
              Gửi lại mã
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
