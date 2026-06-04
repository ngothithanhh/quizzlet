"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Form, FormField, FormItem, FormMessage, useForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { toast } from "@acme/ui/toast";

import { useAuth } from "~/contexts/auth-context";
import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/quizzlet";

const loginSchema = z.object({
  email: z.string().min(1, "Nhập email của bạn").email("Email không hợp lệ"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { onOpenChange } = useSignInDialogContext();

  const form = useForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: LoginValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        toast.error(err.message ?? "Email hoặc mật khẩu không đúng");
        return;
      }

      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
      };
      login(data.accessToken, data.refreshToken);
      onOpenChange(false);
      toast.success("Đăng nhập thành công!");
      window.location.reload();
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <LoaderIcon size={18} className="animate-spin" />
          ) : (
            "Đăng nhập"
          )}
        </Button>

        <div className="text-center text-sm">
          <a
            href="/forgot-password"
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </form>
    </Form>
  );
}
