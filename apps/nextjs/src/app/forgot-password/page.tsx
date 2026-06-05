import type { Metadata } from "next";

import ForgotPasswordForm from "~/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu - Quizzlet",
  description: "Lấy lại mật khẩu của bạn",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
