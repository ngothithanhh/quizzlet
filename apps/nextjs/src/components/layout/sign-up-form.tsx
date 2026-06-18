"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Form, FormField, FormItem, FormMessage, useForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { toast } from "@acme/ui/toast";
import { env } from "~/env";

const BACKEND_URL = env.NEXT_PUBLIC_BACKEND_URL;

const registerSchema = z
  .object({
    username: z.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
    email: z.string().min(1, "Nhập email của bạn").email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

interface SignUpFormProps {
  onOtpSent: (email: string) => void;
}

export default function SignUpForm({ onOtpSent }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    schema: registerSchema,
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ username, email, password }: RegisterValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        toast.error(err.message ?? "Đăng ký thất bại");
        return;
      }

      toast.success(`Mã OTP đã được gửi tới ${email}`);
      onOtpSent(email);
    } catch {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <Label>Tên người dùng</Label>
              <Input
                type="text"
                placeholder="nguyenvana"
                disabled={loading}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                disabled={loading}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={loading}
                  className="pr-10"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon size={16} />
                  ) : (
                    <EyeIcon size={16} />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label>Nhập lại mật khẩu</Label>
              <Input
                type="password"
                placeholder="••••••••"
                disabled={loading}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <LoaderIcon size={18} className="animate-spin" />
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>
    </Form>
  );
}
