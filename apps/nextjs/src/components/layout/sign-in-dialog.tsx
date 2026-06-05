"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@acme/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import OtpVerifyForm from "./otp-verify-form";
import SignUpForm from "./sign-up-form";
import LoginForm from "./sign-in-with-email";
import SignInWithOauth from "./sign-in-with-oauth";

type RegisterStep = "form" | "otp";

const SignInDialog = () => {
  const { open, activeTab, onOpenChange } = useSignInDialogContext();
  const [registerStep, setRegisterStep] = useState<RegisterStep>("form");
  const [otpEmail, setOtpEmail] = useState("");

  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      // Reset register flow when dialog closes
      setTimeout(() => {
        setRegisterStep("form");
        setOtpEmail("");
      }, 300);
    }
  };

  const handleOtpSent = (email: string) => {
    setOtpEmail(email);
    setRegisterStep("otp");
  };

  const handleOtpSuccess = () => {
    setRegisterStep("form");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <Tabs defaultValue={activeTab} key={activeTab}>
          <div className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>
          </div>

          {/* ── LOGIN TAB ── */}
          <TabsContent value="login" className="space-y-4">
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Đăng nhập để tạo bộ thẻ, thư mục của riêng bạn.
            </DialogDescription>

            <SignInWithOauth />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  hoặc
                </span>
              </div>
            </div>

            <LoginForm />
          </TabsContent>

          {/* ── REGISTER TAB ── */}
          <TabsContent value="register" className="space-y-4">
            {registerStep === "form" ? (
              <>
                <DialogDescription className="text-center text-sm text-muted-foreground">
                  Tạo tài khoản miễn phí để bắt đầu học.
                </DialogDescription>

                <SignInWithOauth />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      hoặc
                    </span>
                  </div>
                </div>

                <SignUpForm onOtpSent={handleOtpSent} />
              </>
            ) : (
              <>
                <DialogTitle className="text-center text-base">
                  Xác nhận email
                </DialogTitle>
                <OtpVerifyForm
                  email={otpEmail}
                  onSuccess={handleOtpSuccess}
                  onBack={() => setRegisterStep("form")}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
