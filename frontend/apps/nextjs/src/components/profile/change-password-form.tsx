"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { authApi } from "~/lib/api-client";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("Vui lòng điền đầy đủ thông tin");
    }
    if (newPassword.length < 6) {
      return setError("Mật khẩu mới phải có ít nhất 6 ký tự");
    }
    if (newPassword !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp");
    }

    setIsLoading(true);
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      setSuccess(res.message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Đổi mật khẩu</h3>
          <p className="text-xs text-muted-foreground">Cập nhật mật khẩu để bảo mật tài khoản</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="oldPassword" className="text-sm font-medium text-foreground">
            Mật khẩu hiện tại
          </label>
          <input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={isLoading}
            placeholder="••••••••"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Tối thiểu 6 ký tự"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Xác nhận mật khẩu mới
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Lưu mật khẩu
        </button>
      </form>
    </div>
  );
}
