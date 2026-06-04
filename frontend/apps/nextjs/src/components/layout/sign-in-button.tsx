"use client";

import React from "react";

import { Button } from "@acme/ui/button";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";

export default function SignInButton() {
  const { openWithTab } = useSignInDialogContext();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => openWithTab("login")}
        className="text-foreground"
      >
        Đăng nhập
      </Button>
      <Button onClick={() => openWithTab("register")}>Đăng ký</Button>
    </div>
  );
}
