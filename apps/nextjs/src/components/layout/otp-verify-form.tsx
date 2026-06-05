"use client";

import { useRef, useState } from "react";
import { LoaderIcon, MailIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/quizzlet";

interface OtpVerifyFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function OtpVerifyForm({
  email,
  onSuccess,
  onBack,
}: OtpVerifyFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = paste.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (!res.ok) {
        toast.error("Mã OTP không hợp lệ hoặc đã hết hạn");
        return;
      }

      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
      onSuccess();
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success(`OTP mới đã được gửi tới ${email}`);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error("Không thể gửi lại OTP");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <MailIcon className="h-7 w-7 text-primary" />
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Mã OTP đã được gửi tới
        </p>
        <p className="font-semibold">{email}</p>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-12 text-center text-lg font-bold"
            disabled={loading}
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={loading || otp.join("").length < 6}
      >
        {loading ? (
          <LoaderIcon size={18} className="animate-spin" />
        ) : (
          "Xác nhận"
        )}
      </Button>

      <div className="flex w-full flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? (
            <LoaderIcon size={14} className="animate-spin" />
          ) : (
            "Gửi lại mã OTP"
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={onBack}
          disabled={loading}
        >
          ← Quay lại
        </Button>
      </div>
    </div>
  );
}
